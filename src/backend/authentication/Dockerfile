# ========================================
# Stage 1: Build Stage
# ========================================
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN yarn build

# ========================================
# Stage 2: Dependencies Stage
# ========================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install ONLY production dependencies
RUN yarn install --frozen-lockfile --production --silent && \
    yarn cache clean

# ========================================
# Stage 3: Production Stage (Distroless)
# ========================================
FROM gcr.io/distroless/nodejs22-debian12 AS production

WORKDIR /app

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["dist/index.js"]