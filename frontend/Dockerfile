# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM gcr.io/distroless/nodejs
WORKDIR /app
COPY --from=build /app/build /app

CMD ["serve", "-s", "."]
