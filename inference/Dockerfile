# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S inference -u 1001

# Change ownership of the app directory
RUN chown -R inference:nodejs /app
USER inference

# Expose port (though Waku uses P2P, some monitoring might be useful)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "console.log('Service running')" || exit 1

# Start the inference service
CMD ["npm", "start"] 