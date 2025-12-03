# Use official Node image
FROM node:20

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose Vite dev server port
EXPOSE 3001

# Start Vite in dev mode, accessible from host
CMD ["npm", "run", "dev", "--", "--host"]
