# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies to build)
RUN yarn install --frozen-lockfile

# Copy only necessary source files for building
COPY src/ ./src/
COPY prisma/ ./prisma/
COPY tsconfig.json ./
COPY eslint.config.js ./
COPY nodemon.json ./
COPY .prettierrc ./
COPY .npmrc ./

# Build TypeScript to JavaScript
RUN yarn build:clean

# Production Stage
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Copy Prisma files needed for runtime
COPY --from=build /app/prisma ./prisma

EXPOSE 8000

CMD ["node", "dist/server.js"]
