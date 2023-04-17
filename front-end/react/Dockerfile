# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm install --unsafe-perm

# Copy the rest of the application's source code to the working directory
COPY . ./

# Build the application for production
RUN npm run build

# Expose the port the application will run on
EXPOSE 1234

# Start the application
CMD ["npm", "start"]
