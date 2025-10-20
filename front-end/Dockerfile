# Use official Bun image for Node.js + Bun
FROM oven/bun:1.1.13

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Set environment variables (optional, can be overridden)
ENV NODE_ENV=production

# Build the Next.js app
RUN bun run build

# Start the Next.js app
CMD ["bun", "run", "start"]
