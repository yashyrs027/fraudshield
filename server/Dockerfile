# Use official Node LTS image
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (including dev for testing)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build step (if any) – none for plain JS

# Runtime image
FROM node:20-alpine
WORKDIR /app

# Copy only production dependencies and compiled code
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env.example ./

# Install production deps
RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
