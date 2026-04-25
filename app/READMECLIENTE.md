# 🏎️ F1 Drivers Database - Frontend (Client)

Esta es la aplicación cliente (Frontend) para el proyecto de Base de Datos de Pilotos de Fórmula 1. Está construida con **React** y se encarga de consumir la API RESTFUL del servidor para realizar operaciones CRUD sobre los datos de los pilotos.

## ✨ Características Principales

* **Listado de Pilotos:** Muestra una tabla completa con todos los pilotos registrados, su nacionalidad y su código.
* **Perfil Detallado:** Vista individual para consultar los datos específicos de un piloto (incluyendo resultados y clasificaciones).
* **Gestión de Datos (CRUD):** * Crear nuevos perfiles de pilotos.
    * Editar información existente.
    * Eliminar pilotos de la base de datos de forma dinámica.
* **Navegación Fluida (SPA):** Utiliza `react-router-dom` para navegar entre pantallas sin recargar la página.

## 🛠️ Tecnologías Utilizadas

* **React.js** (Librería principal)
* **React Router DOM** (Enrutamiento de la SPA)
* **CSS / Tailwind CSS** (Clases utilitarias para el diseño de la interfaz)
* **Fetch API** (Para las peticiones HTTP al servidor)

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
Asegúrate de tener Node.js instalado y de que tu **Servidor Backend** (la carpeta `server`) esté en ejecución en el puerto `5050` antes de arrancar el cliente.

### Pasos
1. Abre una terminal y navega hasta la carpeta del cliente:
   ```bash
   cd app
   
2. Instala las dependencias:
   ```bash
   npm install
   
3. Inicia la aplicación:
   ```bash
   npm start
   
Esto abrirá la aplicación en tu navegador en `http://localhost:3000` y podrás comenzar a interactuar con la base de datos de pilotos.