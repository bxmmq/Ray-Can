FROM node:22-alpine

WORKDIR /app

# Copy prisma schema first (needed for postinstall)
COPY prisma ./prisma

# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node_modules/.bin/next", "start"]
