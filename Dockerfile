# Multi-stage build for Angular application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG API_URL
ARG SERVER_URL

# Create environment file for build
RUN echo "export const environment = {" > src/environments/environment.prod.ts && \
    echo "  production: true," >> src/environments/environment.prod.ts && \
    echo "  apiUrl: '${API_URL}'," >> src/environments/environment.prod.ts && \
    echo "  serverUrl: '${SERVER_URL}'" >> src/environments/environment.prod.ts && \
    echo "};" >> src/environments/environment.prod.ts

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Tools for healthcheck
RUN apk add --no-cache curl

# Copy built application from build stage (Angular application builder output)
# Angular 17+/20 with @angular/build:application outputs to dist/<project>/browser
COPY --from=build /app/dist/metis_client/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
