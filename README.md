# Patitas en el corazón - Docker con dos contenedores

Dos servicios comunicados por una red propia de Docker:

- **app**: Node 20 + Express. Sirve las páginas y expone la API `/api/mascotas`.
- **db**: PostgreSQL 16 con volumen para guardar los datos.

La app se conecta a la base de datos usando el nombre del servicio (`db`), no localhost ni una IP.

## Estructura

```
app/                  # servicio 1: aplicación (Dockerfile, server.js, public/)
db/init.sql           # servicio 2: crea la tabla al iniciar
docker-compose.yml
.env.example
.github/workflows/    # CI: construye las imágenes
```

## Cómo levantarlo

1. Copiar las variables de entorno y cambiar la contraseña:
   ```
   cp .env.example .env
   ```
2. Construir y levantar:
   ```
   docker compose up --build
   ```
3. Abrir `http://localhost:8080`.

## Probar la comunicación (guardar y leer)

Guardar:
```
curl -X POST http://localhost:8080/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Luna","tipo":"perro","edad":2}'
```
Leer:
```
curl http://localhost:8080/api/mascotas
```

## Comandos útiles

```
docker compose ps
docker network inspect patitas-net
docker compose down        # apaga (conserva los datos)
docker compose down -v     # apaga y borra el volumen
```

## Seguridad

- El archivo `.env` no se sube al repositorio. Solo se sube `.env.example`.
- La base de datos no expone puertos al host; solo la app la alcanza por la red interna.

## Créditos

El sitio web estático parte del repositorio [AndresMantilla763/patitas_en_el_corazon](https://github.com/AndresMantilla763/patitas_en_el_corazon). 
La contenerización, la API, la base de datos, Docker Compose y GitHub Actions son trabajo propio.
