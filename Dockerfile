# FROM mcr.microsoft.com/playwright:v1.42.1-jammy
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy FULL directory structure
COPY . .

RUN npx playwright install --with-deps

# Respect directory structure, run only demo
# CMD ["npx", "playwright", "test", "-g", "@demo"]
CMD ["npx", "playwright", "test", "tests/"]
