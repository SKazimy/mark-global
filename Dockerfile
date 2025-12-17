# Use official Node.js LTS image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (including devDependencies)
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Vite app
RUN npm run build

# Build the server (if using TypeScript)
RUN npm run build:server || true

# Remove devDependencies for production image
RUN npm prune --omit=dev

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
