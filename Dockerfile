FROM node:22-alpine

WORKDIR /app

# Copy prisma schema first (needed for postinstall)
COPY prisma ./prisma

# Copy package files and install dependencies (skip postinstall)
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy source code
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node_modules/.bin/next", "start"]
