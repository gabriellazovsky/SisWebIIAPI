import React from "react";
import { useParams } from "react-router-dom";

export default function EditDriver() {
    const params = useParams();

    return (
        <div>
            <h2>Editar Piloto ID: {params.id}</h2>
            <p>Aquí pondremos el formulario para editar datos.</p>
        </div>
    );
}