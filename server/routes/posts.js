import express from 'express';

// 1. Inicializamos el Router
const router = express.Router();

// 2. Definimos algunas rutas de prueba (opcional, pero recomendado para probar)
router.get('/', (req, res) => {
    res.json({ mensaje: "¡Las rutas de posts están funcionando!" });
});

// 3. Exportamos el router por defecto (¡Esta es la parte clave!)
export default router;