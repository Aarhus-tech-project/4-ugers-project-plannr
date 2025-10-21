# Use official Bun image
FROM oven/bun:1.3.0

WORKDIR /app

# Copy dependency files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of your source code
COPY . .

# Build the Next.js app
RUN bun run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", "start"]