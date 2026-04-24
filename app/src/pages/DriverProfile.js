import React from "react";
import { useParams } from "react-router-dom";

export default function DriverProfile() {
    const params = useParams();

    return (
        <div>
            <h2>Perfil del Piloto ID: {params.id}</h2>
            <p>Aquí cargaremos los resultados y clasificaciones de este piloto.</p>
        </div>
    );
}