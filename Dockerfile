# FROM node:14-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 80

# CMD ["node", "index.js"]


#stage 1
FROM node:10-alpine as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
#stage 2
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/ /usr/share/nginx/html