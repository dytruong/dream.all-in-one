# ========================================
# Stage 1: Build Stage
# ========================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN yarn build

# ========================================
# Stage 2: Production Stage
# ========================================
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install ONLY production dependencies
RUN yarn install --frozen-lockfile --production --silent && \
    yarn cache clean

# Copy built application
COPY --from=build /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeapp -u 1001

# Change ownership and switch to non-root user
RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 3000
CMD ["node", "dist/index.js"]