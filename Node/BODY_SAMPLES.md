# 📋 Copy-Paste Body Samples cho Postman

> Copy nhanh các body JSON để test API

---

## 🟢 1. TODO API

### POST - Tạo Todo
```json
{
    "title": "Học Node.js cơ bản",
    "description": "Tìm hiểu Express, MongoDB",
    "priority": "high"
}
```

### PUT - Cập nhật Todo
```json
{
    "title": "Todo đã cập nhật",
    "description": "Mô tả mới",
    "completed": true,
    "priority": "medium"
}
```

---

## 🔐 2. AUTH SYSTEM

### POST - Register
```json
{
    "name": "Demo User",
    "email": "demo@test.com",
    "password": "Demo123!"
}
```

### POST - Login Admin
```json
{
    "email": "admin@demo.com",
    "password": "Admin123!"
}
```

### POST - Login Moderator
```json
{
    "email": "mod@demo.com",
    "password": "Mod123!"
}
```

### POST - Login User
```json
{
    "email": "user1@demo.com",
    "password": "User123!"
}
```

### PUT - Update Profile
```json
{
    "name": "Tên mới",
    "age": 25
}
```

### PUT - Change Password
```json
{
    "currentPassword": "Admin123!",
    "newPassword": "NewPass456!"
}
```

---

## 📋 3. TASK MANAGER API

### POST - Tạo Task
```json
{
    "title": "Task demo mới",
    "description": "Đây là task được tạo để demo",
    "priority": "urgent",
    "category": "Backend"
}
```

### PUT - Cập nhật Task
```json
{
    "title": "Task đã update",
    "description": "Mô tả mới",
    "priority": "high"
}
```

### PATCH - Update Status
```json
{
    "status": "in-progress"
}
```

Status options: `pending`, `in-progress`, `completed`, `cancelled`

### POST - Thêm Subtask
```json
{
    "title": "Subtask mới"
}
```

---

## 🌤️ 4. WEATHER API

> Không cần body - chỉ có GET requests

---

## 📝 5. BLOG API (Posts)

### POST - Tạo bài viết
```json
{
    "title": "Bài viết demo",
    "content": "Nội dung bài viết ở đây. Có thể viết dài nhiều dòng.",
    "tags": ["nodejs", "api", "demo"],
    "status": "published"
}
```

### PUT - Cập nhật bài viết
```json
{
    "title": "Tiêu đề mới",
    "content": "Nội dung đã cập nhật",
    "tags": ["updated", "demo"]
}
```

### POST - Thêm Comment
```json
{
    "text": "Comment hay quá!"
}
```

---

## 🛒 6. E-COMMERCE API (Products)

### POST - Tạo sản phẩm
```json
{
    "name": "Laptop Gaming ASUS",
    "description": "Laptop gaming cao cấp RTX 4060",
    "price": 25000000,
    "category": "electronics",
    "stock": 10,
    "featured": true
}
```

### PUT - Cập nhật sản phẩm
```json
{
    "name": "Laptop Gaming Updated",
    "price": 23000000,
    "stock": 8
}
```

### POST - Thêm Review
```json
{
    "rating": 5,
    "comment": "Sản phẩm tuyệt vời! Giao hàng nhanh."
}
```

Rating: 1-5 sao

---

## 📁 7. CATEGORIES API

### POST - Tạo Category
```json
{
    "name": "Điện tử",
    "description": "Các sản phẩm điện tử, công nghệ"
}
```

### PUT - Cập nhật Category
```json
{
    "name": "Electronics",
    "description": "Updated description"
}
```

---

## 👥 8. USERS API

### PUT - Update User (Admin only)
```json
{
    "name": "Updated Name",
    "role": "moderator",
    "isActive": true
}
```

---

## 🔑 Header Authorization

Với các API cần đăng nhập, thêm header:
```
Authorization: Bearer <paste_token_here>
```

---

## 📌 Quick Reference - User Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin123! |
| Moderator | mod@demo.com | Mod123! |
| User | user1@demo.com | User123! |
| User | user2@demo.com | User123! |
