FROM node:20-alpine

WORKDIR /app

# Instalación de dependencias
COPY package*.json ./
RUN npm install --production

# Copia de código fuente
COPY . .

# Script de entrada para manejar variables dinámicas
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "start"]
