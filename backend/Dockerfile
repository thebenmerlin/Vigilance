# =============================================================================
# VIGILANCE BACKEND - Dockerfile
# =============================================================================
# Production Node.js container
#
# Usage:
#   docker build -t vigilance-backend .
#   docker run -p 3001:3001 vigilance-backend
# =============================================================================

# Use Node.js LTS
FROM node:20-alpine

# Add labels
LABEL maintainer="Vigilance Team"
LABEL description="Vigilance Dashboard Backend API"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src ./src

# Install tsx for running TypeScript directly
RUN npm install -g tsx

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the server using tsx
CMD ["tsx", "src/server.ts"]
