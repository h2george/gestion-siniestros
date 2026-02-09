#!/bin/sh

# Generar variables de entorno si no existen (Ejemplo: JWT_SECRET)
if [ -z "$JWT_SECRET" ]; then
  export JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  echo "JWT_SECRET generated"
fi

# Ejecutar el comando principal
exec "$@"
