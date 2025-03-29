# Use Node.js official image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Start the React application
CMD ["npm", "run", "dev"]

