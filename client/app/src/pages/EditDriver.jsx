import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DriverForm, { buildDriverPayload, normalizeDriverForm } from "./DriverForm.jsx";

export default function EditDriver() {
    const params = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(normalizeDriverForm());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDriver() {
            try {
                const response = await fetch(`http://localhost:5050/drivers/${params.id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "No se pudo cargar el piloto.");
                }

                setForm(normalizeDriverForm(data));
            } catch (fetchError) {
                setError(fetchError.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDriver();
    }, [params.id]);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const payload = buildDriverPayload(form);
            const response = await fetch(`http://localhost:5050/drivers/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error || "No se pudo actualizar el piloto.");
            }

            navigate(`/driver/${payload.driverId || params.id}`);
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <div className="text-center mt-10 text-xl font-bold">Cargando piloto...</div>;
    }

    if (error && !form.driverRef) {
        return (
            <div className="max-w-3xl mx-auto bg-white border rounded-lg p-6">
                <p className="text-red-600 mb-4">{error}</p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Volver a la lista
                </Link>
            </div>
        );
    }

    return (
        <DriverForm
            form={form}
            setForm={setForm}
            title={`Editar piloto ID: ${params.id}`}
            submitLabel="Guardar cambios"
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
            driverIdReadOnly
        />
    );
}
