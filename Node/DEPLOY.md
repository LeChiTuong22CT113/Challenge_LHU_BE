# Render Deployment Guide

## Bước 1: Tạo MongoDB Atlas (Free)

1. Truy cập https://cloud.mongodb.com
2. Đăng ký tài khoản (hoặc đăng nhập)
3. Tạo Cluster mới (Free tier - M0)
4. Tạo Database User (username/password)
5. Network Access → Add IP Address → `0.0.0.0/0` (Allow all)
6. Cluster → Connect → Drivers → Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mvc_api
   ```

## Bước 2: Push code lên GitHub

```bash
cd f:\Challenge_LHU_BE\Node
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/challenge-lhu-be.git
git push -u origin main
```

## Bước 3: Deploy trên Render

1. Truy cập https://render.com
2. Đăng ký bằng GitHub
3. New → Web Service
4. Connect Repository → Chọn repo vừa push
5. Cấu hình:
   - **Name:** challenge-lhu-api
   - **Region:** Singapore (gần VN nhất)
   - **Branch:** main
   - **Root Directory:** Node
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

## Bước 4: Environment Variables

Trong Render Dashboard → Environment:

| Key | Value |
|-----|-------|
| `NODE_ENV` | production |
| `PORT` | 10000 |
| `MONGODB_URI` | mongodb+srv://... (từ Atlas) |
| `JWT_SECRET` | your-super-secret-key-here |
| `JWT_EXPIRES_IN` | 7d |

## Bước 5: Deploy

Click **Create Web Service** → Chờ deploy hoàn tất

## URL sau khi deploy:
```
https://challenge-lhu-be.onrender.com
https://challenge-lhu-be.onrender.com/api-docs
```

## Lưu ý:
- Free tier Render sẽ sleep sau 15 phút không hoạt động
- Request đầu tiên sẽ mất ~30s để wake up
- Để upgrade có thể chọn plan trả phí
