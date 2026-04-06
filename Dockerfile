FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY . .

USER nodeuser

EXPOSE 5000
CMD ["node", "server.js"]
