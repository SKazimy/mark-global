# Use official Node.js LTS image

# Stage 1: Build the application
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run build:server || true

# Stage 2: Create the final production image
FROM node:20-slim
WORKDIR /app
# Copy only the necessary production dependencies and the built application
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/server.ts ./server.ts
# If you need other static assets or files, copy them here as well
EXPOSE 8080
CMD ["node", "server.js"]
