# nepali_crowdfund_web/Dockerfile
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000
CMD ["npm", "run", "dev"]
