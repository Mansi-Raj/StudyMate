# Stage 1: Build the Angular app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the compiled Angular files to Nginx's public folder
# NOTE: Check your 'dist' folder locally. You might need to change 'frontend' 
# below to match your actual project name (e.g., dist/clariva-frontend/browser)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80