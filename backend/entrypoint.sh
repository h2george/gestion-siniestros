#!/bin/sh

# Generar variables de entorno si no existen en el archivo .env
AUTH_ENV_FILE="/app/.env"

# Cargar variables si existen para comprobar
if [ -f "$AUTH_ENV_FILE" ]; then
    export $(grep -v '^#' "$AUTH_ENV_FILE" | xargs)
fi

if [ -z "$JWT_SECRET" ]; then
  NEW_JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
  echo "Generating new JWT_SECRET..."
  
  if [ -f "$AUTH_ENV_FILE" ]; then
      # Append to existing .env
      echo "" >> "$AUTH_ENV_FILE"
      echo "JWT_SECRET=$NEW_JWT_SECRET" >> "$AUTH_ENV_FILE"
  else
      # Create new .env
      echo "JWT_SECRET=$NEW_JWT_SECRET" > "$AUTH_ENV_FILE"
  fi
  
  export JWT_SECRET=$NEW_JWT_SECRET
  echo "JWT_SECRET persisted to $AUTH_ENV_FILE"
fi

# Ejecutar el comando principal
exec "$@"
