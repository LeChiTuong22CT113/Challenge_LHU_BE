# 🎬 Hướng Dẫn Demo Chi Tiết - Challenge LHU Backend

> Tài liệu hướng dẫn chạy và demo từng Mini Project

---

## 📋 Mục Lục

1. [Chuẩn Bị Môi Trường](#-chuẩn-bị-môi-trường)
2. [Project 1: Todo API (Memory)](#-project-1-todo-api-memory)
3. [Project 2: Task Manager API](#-project-2-task-manager-api)
4. [Project 3: Auth System](#-project-3-auth-system)
5. [Project 4: Weather/Proxy API](#-project-4-weatherproxy-api)
6. [Project 5: Blog/E-com API](#-project-5-bloge-com-api)
7. [Kịch Bản Demo Tổng Hợp](#-kịch-bản-demo-tổng-hợp)

---

## 🔧 Chuẩn Bị Môi Trường

### Bước 1: Cài đặt Dependencies

```bash
# Mở terminal tại thư mục Node
cd f:\Challenge_LHU_BE\Node

# Cài đặt packages
npm install
```

### Bước 2: Cấu hình Environment

```bash
# Copy file .env.example thành .env
copy .env.example .env
```

Chỉnh sửa file `.env`:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/challenge_lhu
JWT_SECRET=your-super-secret-key-2024
```

### Bước 3: Khởi động MongoDB

**Option A - MongoDB Local:**
```bash
# Đảm bảo MongoDB đang chạy
mongod
```

**Option B - MongoDB Atlas:**
- Sử dụng connection string trong `.env`

### Bước 4: Khởi động Server

```bash
npm run dev
```

✅ Server chạy tại: `http://localhost:3000`

### Công cụ Test API

Sử dụng một trong các công cụ sau:
- **Postman** (khuyến nghị)
- **Thunder Client** (Extension VS Code)
- **cURL** (Command line)
- **Insomnia**

---

## 📝 Project 1: Todo API (Memory)

> **Mục đích:** CRUD cơ bản, lưu trữ trong memory/database  
> **Không cần đăng nhập**

### API Endpoints

| # | Thao tác | Method | URL |
|---|----------|--------|-----|
| 1 | Lấy tất cả todos | GET | `http://localhost:3000/api/todos` |
| 2 | Tạo todo mới | POST | `http://localhost:3000/api/todos` |
| 3 | Lấy todo theo ID | GET | `http://localhost:3000/api/todos/:id` |
| 4 | Cập nhật todo | PUT | `http://localhost:3000/api/todos/:id` |
| 5 | Toggle hoàn thành | PATCH | `http://localhost:3000/api/todos/:id/toggle` |
| 6 | Xóa todo | DELETE | `http://localhost:3000/api/todos/:id` |

### Kịch bản Demo

#### 1️⃣ Tạo Todo mới
```http
POST http://localhost:3000/api/todos
Content-Type: application/json

{
    "title": "Học Node.js cơ bản",
    "completed": false
}
```

**Response mẫu:**
```json
{
    "success": true,
    "data": {
        "_id": "65abc123...",
        "title": "Học Node.js cơ bản",
        "completed": false,
        "createdAt": "2024-01-20T10:00:00.000Z"
    }
}
```

#### 2️⃣ Tạo thêm vài todos
```json
// Todo 2
{ "title": "Hoàn thành bài tập Express", "completed": false }

// Todo 3
{ "title": "Đọc tài liệu MongoDB", "completed": true }
```

#### 3️⃣ Xem tất cả todos
```http
GET http://localhost:3000/api/todos
```

#### 4️⃣ Toggle trạng thái hoàn thành
```http
PATCH http://localhost:3000/api/todos/{id}/toggle
```

#### 5️⃣ Cập nhật todo
```http
PUT http://localhost:3000/api/todos/{id}
Content-Type: application/json

{
    "title": "Học Node.js nâng cao",
    "completed": true
}
```

#### 6️⃣ Xóa todo
```http
DELETE http://localhost:3000/api/todos/{id}
```

---

## 📋 Project 2: Task Manager API

> **Mục đích:** Quản lý công việc phức tạp với subtasks, priority, status  
> **⚠️ YÊU CẦU ĐĂNG NHẬP**

### API Endpoints

| # | Thao tác | Method | URL |
|---|----------|--------|-----|
| 1 | Thống kê tasks | GET | `/api/tasks/stats` |
| 2 | Lấy tất cả tasks | GET | `/api/tasks` |
| 3 | Lấy task theo ID | GET | `/api/tasks/:id` |
| 4 | Tạo task mới | POST | `/api/tasks` |
| 5 | Cập nhật task | PUT | `/api/tasks/:id` |
| 6 | Cập nhật status | PATCH | `/api/tasks/:id/status` |
| 7 | Thêm subtask | POST | `/api/tasks/:id/subtasks` |
| 8 | Toggle subtask | PATCH | `/api/tasks/:id/subtasks/:subtaskId` |
| 9 | Xóa task | DELETE | `/api/tasks/:id` |

### Kịch bản Demo

> **Trước tiên:** Phải đăng nhập để lấy token (xem [Project 3: Auth System](#-project-3-auth-system))

#### 1️⃣ Tạo Task mới
```http
POST http://localhost:3000/api/tasks
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "title": "Hoàn thành dự án Backend",
    "description": "Xây dựng API hoàn chỉnh cho Challenge LHU",
    "priority": "high",
    "dueDate": "2024-02-15"
}
```

**Priority options:** `low`, `medium`, `high`, `urgent`

#### 2️⃣ Thêm Subtasks
```http
POST http://localhost:3000/api/tasks/{taskId}/subtasks
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "title": "Viết Todo API"
}
```

Thêm các subtasks khác:
```json
{ "title": "Viết Auth System" }
{ "title": "Viết Task Manager API" }
{ "title": "Viết Weather Proxy API" }
{ "title": "Viết Blog/E-com API" }
```

#### 3️⃣ Toggle Subtask hoàn thành
```http
PATCH http://localhost:3000/api/tasks/{taskId}/subtasks/{subtaskId}
Authorization: Bearer <your_token>
```

#### 4️⃣ Cập nhật Status
```http
PATCH http://localhost:3000/api/tasks/{taskId}/status
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "status": "in_progress"
}
```

**Status options:** `todo`, `in_progress`, `review`, `done`

#### 5️⃣ Xem thống kê
```http
GET http://localhost:3000/api/tasks/stats
Authorization: Bearer <your_token>
```

---

## 🔐 Project 3: Auth System

> **Mục đích:** Xác thực người dùng với JWT  
> **Bao gồm:** Register, Login, Profile, Password

### API Endpoints

| # | Thao tác | Method | URL | Auth |
|---|----------|--------|-----|------|
| 1 | Đăng ký | POST | `/api/auth/register` | ❌ |
| 2 | Đăng nhập | POST | `/api/auth/login` | ❌ |
| 3 | Lấy thông tin user | GET | `/api/auth/me` | ✅ |
| 4 | Cập nhật profile | PUT | `/api/auth/profile` | ✅ |
| 5 | Upload avatar | POST | `/api/auth/avatar` | ✅ |
| 6 | Đổi mật khẩu | PUT | `/api/auth/password` | ✅ |
| 7 | Quên mật khẩu | POST | `/api/auth/forgot-password` | ❌ |
| 8 | Reset mật khẩu | POST | `/api/auth/reset-password/:token` | ❌ |

### Kịch bản Demo

#### 1️⃣ Đăng ký tài khoản
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "username": "demo_user",
    "email": "demo@example.com",
    "password": "Demo1234!"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Đăng ký thành công",
    "data": {
        "user": {
            "_id": "...",
            "username": "demo_user",
            "email": "demo@example.com",
            "role": "user"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

#### 2️⃣ Đăng nhập
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
    "email": "demo@example.com",
    "password": "Demo1234!"
}
```

> 📌 **Lưu lại token** từ response để sử dụng cho các API khác

#### 3️⃣ Xem thông tin cá nhân
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer <your_token>
```

#### 4️⃣ Cập nhật Profile
```http
PUT http://localhost:3000/api/auth/profile
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "username": "demo_user_updated",
    "bio": "Đây là tài khoản demo"
}
```

#### 5️⃣ Đổi mật khẩu
```http
PUT http://localhost:3000/api/auth/password
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "currentPassword": "Demo1234!",
    "newPassword": "NewDemo5678!"
}
```

---

## 🌤️ Project 4: Weather/Proxy API

> **Mục đích:** Proxy API để lấy dữ liệu thời tiết từ bên thứ 3  
> **Không cần đăng nhập**

### API Endpoints

| # | Thao tác | Method | URL |
|---|----------|--------|-----|
| 1 | Thời tiết theo thành phố | GET | `/api/proxy/weather/:city` |
| 2 | Thời tiết theo tọa độ | GET | `/api/proxy/weather/coords?lat=...&lon=...` |
| 3 | Dự báo 5 ngày | GET | `/api/proxy/forecast/:city` |
| 4 | Proxy fetch tổng quát | POST | `/api/proxy/fetch` |

### Kịch bản Demo

#### 1️⃣ Lấy thời tiết Hà Nội
```http
GET http://localhost:3000/api/proxy/weather/Hanoi
```

**Response mẫu:**
```json
{
    "success": true,
    "data": {
        "city": "Hanoi",
        "country": "VN",
        "temperature": 25,
        "description": "Trời quang",
        "humidity": 70,
        "wind": 5.2
    }
}
```

#### 2️⃣ Lấy thời tiết theo tọa độ
```http
GET http://localhost:3000/api/proxy/weather/coords?lat=21.0285&lon=105.8542
```

#### 3️⃣ Dự báo 5 ngày
```http
GET http://localhost:3000/api/proxy/forecast/HoChiMinh
```

#### 4️⃣ [BONUS] Demo giao diện Web
Mở trình duyệt và truy cập:
```
http://localhost:3000/weather.html
```

Giao diện web sẽ hiển thị:
- Ô nhập tên thành phố
- Hiển thị thời tiết hiện tại
- Biểu đồ dự báo 5 ngày

---

## 🛍️ Project 5: Blog/E-com API

> **Mục đích:** API đầy đủ cho Blog và E-commerce  
> **Bao gồm:** Posts, Products, Categories, Comments, Reviews

### 5.1 Blog API (Posts)

| # | Thao tác | Method | URL | Auth |
|---|----------|--------|-----|------|
| 1 | Lấy tất cả bài viết | GET | `/api/posts` | ❌ |
| 2 | Chi tiết bài viết | GET | `/api/posts/:id` | ❌ |
| 3 | Bài viết theo user | GET | `/api/posts/user/:userId` | ❌ |
| 4 | Tạo bài viết | POST | `/api/posts` | ✅ |
| 5 | Bài viết của tôi | GET | `/api/posts/me/posts` | ✅ |
| 6 | Cập nhật bài viết | PUT | `/api/posts/:id` | ✅ |
| 7 | Xóa bài viết | DELETE | `/api/posts/:id` | ✅ |
| 8 | Thêm comment | POST | `/api/posts/:id/comments` | ✅ |
| 9 | Like/Unlike | POST | `/api/posts/:id/like` | ✅ |

#### Kịch bản Demo Blog

**1️⃣ Tạo bài viết:**
```http
POST http://localhost:3000/api/posts
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "title": "Hướng dẫn học Node.js từ cơ bản đến nâng cao",
    "content": "Node.js là một runtime environment cho phép chạy JavaScript ở phía server...",
    "tags": ["nodejs", "javascript", "backend"]
}
```

**2️⃣ Xem tất cả bài viết:**
```http
GET http://localhost:3000/api/posts
```

**3️⃣ Thêm Comment:**
```http
POST http://localhost:3000/api/posts/{postId}/comments
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "content": "Bài viết rất hay và hữu ích!"
}
```

**4️⃣ Like bài viết:**
```http
POST http://localhost:3000/api/posts/{postId}/like
Authorization: Bearer <your_token>
```

---

### 5.2 E-commerce API (Products)

| # | Thao tác | Method | URL | Auth |
|---|----------|--------|-----|------|
| 1 | Lấy tất cả sản phẩm | GET | `/api/products` | ❌ |
| 2 | Sản phẩm nổi bật | GET | `/api/products/featured` | ❌ |
| 3 | Sản phẩm theo category | GET | `/api/products/category/:category` | ❌ |
| 4 | Chi tiết sản phẩm | GET | `/api/products/:id` | ❌ |
| 5 | Sản phẩm của tôi | GET | `/api/products/seller/my` | ✅ |
| 6 | Tạo sản phẩm | POST | `/api/products` | ✅ |
| 7 | Cập nhật sản phẩm | PUT | `/api/products/:id` | ✅ |
| 8 | Xóa sản phẩm | DELETE | `/api/products/:id` | ✅ |
| 9 | Thêm review | POST | `/api/products/:id/reviews` | ✅ |
| 10 | Xóa review | DELETE | `/api/products/:id/reviews/:reviewId` | ✅ |

#### Kịch bản Demo E-commerce

**1️⃣ Tạo sản phẩm:**
```http
POST http://localhost:3000/api/products
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "name": "Laptop Gaming ASUS ROG",
    "description": "Laptop gaming cao cấp với RTX 4060",
    "price": 25000000,
    "category": "electronics",
    "stock": 10,
    "featured": true
}
```

**2️⃣ Xem sản phẩm nổi bật:**
```http
GET http://localhost:3000/api/products/featured
```

**3️⃣ Lọc theo category:**
```http
GET http://localhost:3000/api/products/category/electronics
```

**4️⃣ Thêm Review:**
```http
POST http://localhost:3000/api/products/{productId}/reviews
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "rating": 5,
    "comment": "Sản phẩm chất lượng, giao hàng nhanh!"
}
```

---

### 5.3 Categories API

| # | Thao tác | Method | URL |
|---|----------|--------|-----|
| 1 | Lấy tất cả categories | GET | `/api/categories` |
| 2 | Tạo category | POST | `/api/categories` |
| 3 | Cập nhật category | PUT | `/api/categories/:id` |
| 4 | Xóa category | DELETE | `/api/categories/:id` |

---

## 🎥 Kịch Bản Demo Tổng Hợp

### Thứ tự demo đề xuất (15-20 phút):

```
┌─────────────────────────────────────────────────────────────┐
│  1. KHỞI ĐỘNG (2 phút)                                      │
│     - Mở terminal, cd vào project                           │
│     - npm run dev                                           │
│     - Mở Postman/Thunder Client                             │
├─────────────────────────────────────────────────────────────┤
│  2. AUTH SYSTEM (3 phút)                                    │
│     - Đăng ký user mới                                      │
│     - Đăng nhập để lấy token                                │
│     - Xem thông tin /me                                     │
├─────────────────────────────────────────────────────────────┤
│  3. TODO API (2 phút)                                       │
│     - Tạo 2-3 todos                                         │
│     - Toggle, Update, Delete                                │
├─────────────────────────────────────────────────────────────┤
│  4. TASK MANAGER (3 phút)                                   │
│     - Tạo task với priority cao                             │
│     - Thêm 2-3 subtasks                                     │
│     - Toggle subtasks, cập nhật status                      │
│     - Xem thống kê                                          │
├─────────────────────────────────────────────────────────────┤
│  5. WEATHER API (3 phút)                                    │
│     - Gọi API weather cho vài thành phố                     │
│     - Mở trang weather.html demo giao diện                  │
├─────────────────────────────────────────────────────────────┤
│  6. BLOG/E-COM API (5 phút)                                 │
│     - Tạo bài viết mới                                      │
│     - Comment và Like                                       │
│     - Tạo sản phẩm mới                                      │
│     - Thêm review                                           │
│     - Lọc theo category, featured                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Tài Liệu Bổ Sung

- **Swagger API Docs:** `http://localhost:3000/api-docs` (nếu có)
- **Postman Collection:** Import file `postman_collection.json` (nếu có)

---

## ❓ Troubleshooting

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `ECONNREFUSED` | MongoDB chưa chạy | Khởi động MongoDB |
| `Invalid token` | Token hết hạn/sai | Đăng nhập lại lấy token mới |
| `Validation Error` | Thiếu field bắt buộc | Kiểm tra body request |
| `404 Not Found` | Sai endpoint | Kiểm tra lại URL |

---

**Chúc bạn demo thành công! 🎉**
