- Este script sirve para poder importar JSON a la base de datos. 
- Para poder usarlo, la manera más cómoda y persistente es, en nuestro package.json (dentro de "server/"), añadir dentro de scripts:

        "import:json": "node scripts/importJsonData.mjs"

- Para importar un JSON a la base de datos, hacemos en una terminal dentro de server/:
        
        npm run import:json -> Se importará el JSON de ejemplo ("/server/data/drivers-example.json") + cualquiera creado

- Y para comprobar que funciona:

        npm start
        curl http://localhost:5050/drivers/1001 (por ejemplo)