# --- build stage: compile TypeScript ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- runtime stage: production deps + compiled output only ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY data ./data

# Railway/Render inject PORT at runtime; server.ts already reads process.env.PORT.
EXPOSE 4001
CMD ["node", "dist/server.js"]
