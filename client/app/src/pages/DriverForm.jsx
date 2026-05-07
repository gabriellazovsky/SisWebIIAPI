import React from "react";

const emptyDriver = {
    driverId: "",
    driverRef: "",
    number: "",
    code: "",
    forename: "",
    surname: "",
    dob: "",
    nationality: "",
    url: ""
};

export function normalizeDriverForm(driver) {
    if (!driver) return emptyDriver;

    return {
        driverId: driver.driverId ?? "",
        driverRef: driver.driverRef ?? "",
        number: driver.number ?? "",
        code: driver.code ?? "",
        forename: driver.forename ?? "",
        surname: driver.surname ?? "",
        dob: driver.dob ? String(driver.dob).slice(0, 10) : "",
        nationality: driver.nationality ?? "",
        url: driver.url ?? ""
    };
}

export function buildDriverPayload(form) {
    const payload = {
        driverRef: form.driverRef.trim(),
        forename: form.forename.trim(),
        surname: form.surname.trim(),
        nationality: form.nationality.trim()
    };

    if (form.driverId !== "") payload.driverId = Number(form.driverId);
    if (form.number !== "") payload.number = Number.isNaN(Number(form.number)) ? form.number : Number(form.number);
    if (form.code.trim() !== "") payload.code = form.code.trim().toUpperCase();
    if (form.dob !== "") payload.dob = form.dob;
    if (form.url.trim() !== "") payload.url = form.url.trim();

    return payload;
}

export default function DriverForm({
    form,
    setForm,
    title,
    submitLabel,
    onSubmit,
    submitting,
    error,
    driverIdReadOnly = false
}) {
    function updateField(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    return (
        <div className="max-w-3xl mx-auto bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">
                Completa los datos y se guardaran directamente en la base de datos mediante la API.
            </p>

            {error ? (
                <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
                    {error}
                </div>
            ) : null}

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <label className="block">
                    <span className="block font-semibold mb-1">ID del piloto</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        type="number"
                        name="driverId"
                        value={form.driverId}
                        onChange={updateField}
                        readOnly={driverIdReadOnly}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Referencia</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        name="driverRef"
                        value={form.driverRef}
                        onChange={updateField}
                        placeholder="alonso"
                        required
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Nombre</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        name="forename"
                        value={form.forename}
                        onChange={updateField}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Apellido</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        name="surname"
                        value={form.surname}
                        onChange={updateField}
                        required
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Numero</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        type="number"
                        name="number"
                        value={form.number}
                        onChange={updateField}
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Codigo</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        name="code"
                        value={form.code}
                        onChange={updateField}
                        maxLength="3"
                        placeholder="ALO"
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Fecha de nacimiento</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={updateField}
                    />
                </label>

                <label className="block">
                    <span className="block font-semibold mb-1">Nacionalidad</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        name="nationality"
                        value={form.nationality}
                        onChange={updateField}
                        required
                    />
                </label>

                <label className="block md:col-span-2">
                    <span className="block font-semibold mb-1">URL</span>
                    <input
                        className="w-full border rounded px-3 py-2"
                        type="url"
                        name="url"
                        value={form.url}
                        onChange={updateField}
                        placeholder="https://..."
                    />
                </label>

                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Guardando..." : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}
