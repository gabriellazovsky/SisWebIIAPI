import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Este es un sub-componente equivalente al "Record" del tutorial de MongoDB
const DriverRow = (props) => (
    <tr>
        <td className="border px-4 py-2">{props.driver.forename} {props.driver.surname}</td>
        <td className="border px-4 py-2">{props.driver.nationality}</td>
        <td className="border px-4 py-2">{props.driver.code || "N/A"}</td>
        <td className="border px-4 py-2">
            <Link to={`/driver/${props.driver.driverId}`} className="text-blue-500 mr-4">Ver Perfil</Link>
            <Link to={`/edit/${props.driver.driverId}`} className="text-green-500 mr-4">Editar</Link>
            <button
                className="text-red-500"
                onClick={() => { props.deleteDriver(props.driver.driverId); }}
            >
                Borrar
            </button>
        </td>
    </tr>
);

export default function DriversList() {
    const [drivers, setDrivers] = useState([]);

    // Fetch para obtener los datos al cargar la página
    useEffect(() => {
        async function getDrivers() {
            const response = await fetch(`http://localhost:5050/driverRoutes`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();
            setDrivers(records);
        }

        getDrivers();
    }, []);

    // Función para borrar un piloto conectada a tu DELETE /:id
    async function deleteDriver(id) {
        await fetch(`http://localhost:5050/driverRoutes/${id}`, {
            method: "DELETE"
        });

        // Actualizamos el estado para que desaparezca de la pantalla sin recargar
        const newDrivers = drivers.filter((el) => el.driverId !== id);
        setDrivers(newDrivers);
    }

    // Mapeamos los datos
    function driverList() {
        return drivers.map((driver) => {
            return (
                <DriverRow
                    driver={driver}
                    deleteDriver={() => deleteDriver(driver.driverId)}
                    key={driver._id}
                />
            );
        });
    }

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Lista de Pilotos (F1)</h3>
            <table className="table-auto w-full text-left">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Nacionalidad</th>
                    <th className="px-4 py-2">Código</th>
                    <th className="px-4 py-2">Acciones</th>
                </tr>
                </thead>
                <tbody>{driverList()}</tbody>
            </table>
        </div>
    );
}