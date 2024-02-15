# FROM node:14 as build
# FROM node:slim as build
# WORKDIR /user/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# FROM nginx:alpine
# COPY --from=build /user/src/app/build /user/share/nginx/html
# EXPOSE 3001
# CMD ["nginx", "-g", "daemon off;","npm","start"]
# FROM node:14-alpine as build
# WORKDIR /ekaggata-timesheet-mgt/front-end/
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# FROM nginx:alpine
# COPY --from=build /front-end/build /usr/share/nginx/html
# COPY --from=build /app/build /usr/share/nginx/html
# COPY front-end/build /usr/share/nginx/html
# COPY /build /usr/share/nginx/html
# EXPOSE 3001
# CMD ["nginx", "-g", "daemon off;","npm","start"]
# FROM node:16
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# CMD ["npm", "start"]
# FROM node:16 as build-stage
FROM node:16
WORKDIR /front-end
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm start
# Build the project for production
# RUN npm run build
# Use nginx to serve the React app
# FROM nginx:stable-alpine as production-stage
# Copy the build output to replace the default nginx contents.
# COPY --from=build-stage /front-end/build /usr/share/nginx/html
# Expose port 80 to the outside once the container has launched
# EXPOSE 3000
# No need to specify CMD because it's inherited from the nginx base image