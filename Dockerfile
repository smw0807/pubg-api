# Base image
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:22-alpine AS production

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose port
EXPOSE 3000

# Start the server
CMD [ "node", "dist/main.js" ]