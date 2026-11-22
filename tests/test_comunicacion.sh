#!/bin/sh
set -e

C="docker compose -p ci -f docker-compose.yml -f docker-compose.ci.yml"

echo "1) La app usa el nombre del servicio como host de la base"
HOST=$($C exec -T app printenv DB_HOST)
echo "DB_HOST=$HOST"
[ "$HOST" = "db" ] || { echo "ERROR: DB_HOST debe ser db"; exit 1; }

echo "2) Enviar un dato a la API (la app lo guarda en la base db)"
$C exec -T app wget -qO- --header='Content-Type: application/json' --post-data='{"nombre":"PruebaCI","tipo":"perro","edad":1}' http://localhost:3000/api/mascotas
echo ""

echo "3) Leer el dato desde la API (la app lo lee de la base db)"
RESP=$($C exec -T app wget -qO- http://localhost:3000/api/mascotas)
echo "$RESP"
echo "$RESP" | grep -q "PruebaCI" || { echo "ERROR: el dato no volvio de la base"; exit 1; }

echo "Prueba OK: ida y vuelta entre app y db"