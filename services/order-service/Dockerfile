FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache curl
RUN npm install
COPY . .
EXPOSE 5004
CMD ["npm", "run", "dev"]
