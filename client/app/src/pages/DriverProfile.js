import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function DriverProfile() {
    const params = useParams();

    // Creamos 3 estados para guardar las 3 cosas que vamos a pedir a la base de datos
    const [driver, setDriver] = useState(null);
    const [results, setResults] = useState([]);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDriverData() {
            try {
                const normalizeArray = (payload) => {
                    if (Array.isArray(payload)) return payload;
                    if (Array.isArray(payload?.data)) return payload.data;
                    return [];
                };

                // 1. Pedimos los datos personales del piloto
                const driverRes = await fetch(`http://localhost:5050/drivers/${params.id}`);
                const driverData = await driverRes.json();

                // 2. Pedimos sus resultados en carreras
                const resultsRes = await fetch(`http://localhost:5050/drivers/${params.id}/results`);
                const resultsData = await resultsRes.json();

                // 3. Pedimos sus clasificaciones en el campeonato
                const standingsRes = await fetch(`http://localhost:5050/drivers/${params.id}/standings`);
                const standingsData = await standingsRes.json();

                // Guardamos todo en el estado de React
                setDriver(driverData);
                setResults(normalizeArray(resultsData));
                setStandings(normalizeArray(standingsData));
                setLoading(false);

            } catch (error) {
                console.error("Error al cargar los datos del piloto:", error);
                setLoading(false);
            }
        }

        fetchDriverData();
    }, [params.id]);

    // Pantalla de carga mientras llegan los datos
    if (loading) {
        return <div className="text-center mt-10 text-xl font-bold">⏳ Cargando telemetría del piloto...</div>;
    }

    // Si el piloto no existe o el ID está mal
    if (!driver || driver.message === "Piloto no encontrado") {
        return <div className="text-center mt-10 text-xl text-red-500">❌ Piloto no encontrado</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Botón para volver */}
            <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
                &larr; Volver a la parrilla
            </Link>

            {/* CABECERA: Datos Personales */}
            <div className="bg-gray-800 text-white rounded-lg p-6 mb-8 shadow-lg">
                <h1 className="text-4xl font-bold mb-2">
                    {driver.forename} {driver.surname} <span className="text-gray-400 text-2xl">#{driver.number || "N/A"}</span>
                </h1>
                <div className="grid grid-cols-2 gap-4 mt-4 text-lg">
                    <p>🌍 <strong>Nacionalidad:</strong> {driver.nationality}</p>
                    <p>🎂 <strong>Nacimiento:</strong> {new Date(driver.dob).toLocaleDateString()}</p>
                    <p>🪪 <strong>Código:</strong> {driver.code || "N/A"}</p>
                    <p>🔗 <strong>Wikipedia:</strong> <a href={driver.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Ver Biografía</a></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* COLUMNA 1: Clasificaciones (Standings) */}
                <div className="bg-white rounded-lg p-6 shadow-md border">
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">🏆 Clasificaciones</h2>
                    {!Array.isArray(standings) || standings.length === 0 ? (
                        <p className="text-gray-500">No hay datos de clasificación.</p>
                    ) : (
                        <ul className="space-y-3">
                            {standings.map((standing) => (
                                <li key={standing._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                                    <span><strong>Carrera ID:</strong> {standing.raceId}</span>
                                    <div className="text-right">
                                        <span className="block font-bold text-green-600">Posición: {standing.position}</span>
                                        <span className="block text-sm text-gray-600">{standing.points} Puntos | {standing.wins} Victorias</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* COLUMNA 2: Resultados (Carreras) */}
                <div className="bg-white rounded-lg p-6 shadow-md border">
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">🏁 Resultados (Top 10)</h2>
                    {!Array.isArray(results) || results.length === 0 ? (
                        <p className="text-gray-500">No hay datos de resultados.</p>
                    ) : (
                        <ul className="space-y-3">
                            {/* Mostramos solo los primeros 10 resultados para no saturar la pantalla */}
                            {results.slice(0, 10).map((result) => (
                                <li key={result._id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                                    <span><strong>Carrera ID:</strong> {result.raceId}</span>
                                    <div className="text-right">
                                        <span className="block font-bold text-blue-600">Puesto: {result.positionText || result.position}</span>
                                        <span className="block text-sm text-gray-600">Parrilla: {result.grid} | Puntos: {result.points}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}