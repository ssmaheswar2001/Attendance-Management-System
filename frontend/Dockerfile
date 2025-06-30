FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

# Set production environment
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]