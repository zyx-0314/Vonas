FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

# Simple start command
CMD ["npx", "next", "dev", "--hostname", "0.0.0.0"]