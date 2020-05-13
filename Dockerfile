  # build stage
  #FROM node:lts-alpine as build-stage
  #WORKDIR /app
  #COPY package*.json ./
  #RUN npm install --registry https://registry.npm.taobao.org
  #COPY . .
  #RUN npm run build

# production stage
FROM nginx:alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
