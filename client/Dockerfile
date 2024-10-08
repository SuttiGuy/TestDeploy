# Step 1: Build React App
FROM node:alpine3.18 AS build
WORKDIR /app/client
COPY package.json . 
RUN npm install 
COPY . . 
RUN npm run build 

# Step 2: Serve With Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html 
RUN rm -rf * 
COPY --from=build /app/client/dist .
EXPOSE 80 
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
