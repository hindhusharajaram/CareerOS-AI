# =============================================================================
# CareerOS AI Frontend Service — Production Multi-Stage Dockerfile
# Stage 1: Node.js 20 Builder
# Stage 2: Nginx Static Web Server & Reverse Proxy
# =============================================================================

# --- Stage 1: Build Static Production Assets ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production Vite bundle
COPY . ./
RUN npm run build

# --- Stage 2: Nginx Web Server ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy compiled SPA dist assets from builder stage
COPY --from=builder /app/dist ./

# Copy Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck probe for Nginx web server
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
