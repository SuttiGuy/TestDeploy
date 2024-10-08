FROM node:20.16.0

WORKDIR /usr/src/app/Server
ENV NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY . .

# สร้างไฟล์ JavaScript จาก TypeScript
RUN npm run build

# เปิดพอร์ต 3000 สำหรับการเข้าถึงแอปพลิเคชัน
EXPOSE 3000

# รันแอปพลิเคชัน
CMD ["node", "dist/server.js"]

