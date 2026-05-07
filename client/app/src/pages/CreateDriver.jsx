import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverForm, { buildDriverPayload, normalizeDriverForm } from "./DriverForm.jsx";

export default function CreateDriver() {
    const navigate = useNavigate();
    const [form, setForm] = useState(normalizeDriverForm());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function suggestNextDriverId() {
            try {
                const response = await fetch("http://localhost:5050/drivers");
                if (!response.ok) return;

                const drivers = await response.json();
                const maxId = drivers
                    .map((driver) => Number(driver.driverId))
                    .filter((id) => Number.isInteger(id))
                    .reduce((max, id) => Math.max(max, id), 0);

                setForm((current) => ({
                    ...current,
                    driverId: current.driverId || maxId + 1
                }));
            } catch (fetchError) {
                console.error("Error al sugerir el siguiente ID:", fetchError);
            }
        }

        suggestNextDriverId();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const payload = buildDriverPayload(form);
            const response = await fetch("http://localhost:5050/drivers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error || "No se pudo crear el piloto.");
            }

            navigate(`/driver/${payload.driverId}`);
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <DriverForm
            form={form}
            setForm={setForm}
            title="Crear piloto"
            submitLabel="Crear piloto"
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
        />
    );
}
