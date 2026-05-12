
Este script sirve para poder, tal y como se exige en la documentación OpenAPI, compatibilizar /circuits con el formato XML.

Esto hace que sea posible desde terminar realizar la siguiente petición al servidor:

curl -H "Accept: application/xml" http://localhost:5050/circuits

Y este te devolverá los datos en formato XML en lugar de en formato JSON (que es lo establecido de manera predeterminada).