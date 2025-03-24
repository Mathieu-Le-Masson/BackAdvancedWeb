FROM node:18-alpine

WORKDIR /app

# Install build dependencies needed for bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

# Install dependencies including ts-node globally
RUN npm install
RUN npm install -g ts-node typescript

# Copy project files
COPY . .

# Rebuild bcrypt for the current architecture
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["npm", "run", "start"]