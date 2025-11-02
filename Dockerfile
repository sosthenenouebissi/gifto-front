# Étape 1 : Build Angular
FROM node:20 AS build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Étape 2 : Serveur NGINX
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist/gifto-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
