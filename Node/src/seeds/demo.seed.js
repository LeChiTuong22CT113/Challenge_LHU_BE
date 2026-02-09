/**
 * Demo Seed Script
 * Tạo sample data cho todos, tasks, posts
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Models
const Todo = require('../models/todo.model');
const Task = require('../models/task.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Lấy user đầu tiên trong database
        const user = await User.findOne();
        if (!user) {
            console.error('❌ Không tìm thấy user nào. Hãy đăng ký user trước!');
            process.exit(1);
        }

        console.log(`👤 Sử dụng user: ${user.username} (${user._id})`);

        // ============ SEED TODOS ============
        console.log('\n📝 Đang tạo Todos...');
        await Todo.deleteMany({}); // Clear existing

        const todos = [
            {
                title: 'Học Node.js cơ bản',
                description: 'Tìm hiểu về Event Loop, Modules, và npm',
                completed: true,
                priority: 'high',
                user: user._id,
                tags: ['nodejs', 'javascript']
            },
            {
                title: 'Xây dựng REST API với Express',
                description: 'Tạo CRUD endpoints với Express.js',
                completed: true,
                priority: 'high',
                user: user._id,
                tags: ['express', 'api']
            },
            {
                title: 'Kết nối MongoDB với Mongoose',
                description: 'Thiết kế schema và thực hiện query',
                completed: false,
                priority: 'medium',
                user: user._id,
                tags: ['mongodb', 'database']
            },
            {
                title: 'Implement Authentication JWT',
                description: 'Xây dựng hệ thống đăng nhập với JWT token',
                completed: false,
                priority: 'high',
                user: user._id,
                tags: ['auth', 'jwt', 'security']
            },
            {
                title: 'Viết Unit Tests với Jest',
                description: 'Test các API endpoints với Jest và Supertest',
                completed: false,
                priority: 'low',
                user: user._id,
                tags: ['testing', 'jest']
            }
        ];

        await Todo.insertMany(todos);
        console.log(`✅ Đã tạo ${todos.length} todos`);

        // ============ SEED TASKS ============
        console.log('\n📋 Đang tạo Tasks...');
        await Task.deleteMany({}); // Clear existing

        const tasks = [
            {
                title: 'Hoàn thành Mini Project Todo API',
                description: 'Xây dựng CRUD API cho quản lý todo list',
                status: 'completed',
                priority: 'high',
                createdBy: user._id,
                assignedTo: user._id,
                category: 'Backend',
                tags: ['nodejs', 'api'],
                subtasks: [
                    { title: 'Thiết kế Todo Schema', completed: true },
                    { title: 'Viết Controller CRUD', completed: true },
                    { title: 'Tạo Routes', completed: true }
                ]
            },
            {
                title: 'Xây dựng Auth System',
                description: 'Implement đăng ký, đăng nhập, và bảo mật JWT',
                status: 'completed',
                priority: 'urgent',
                createdBy: user._id,
                assignedTo: user._id,
                category: 'Backend',
                tags: ['auth', 'security'],
                subtasks: [
                    { title: 'Tạo User Model', completed: true },
                    { title: 'Implement Register/Login', completed: true },
                    { title: 'Middleware xác thực', completed: true }
                ]
            },
            {
                title: 'Tích hợp Weather API',
                description: 'Proxy API thời tiết từ OpenWeatherMap',
                status: 'in-progress',
                priority: 'medium',
                createdBy: user._id,
                assignedTo: user._id,
                category: 'Integration',
                tags: ['api', 'weather'],
                subtasks: [
                    { title: 'Tạo Proxy Controller', completed: true },
                    { title: 'Xử lý API key', completed: true },
                    { title: 'Tạo UI demo', completed: false }
                ]
            },
            {
                title: 'Phát triển Blog/E-com API',
                description: 'API cho bài viết và sản phẩm e-commerce',
                status: 'in-progress',
                priority: 'high',
                createdBy: user._id,
                assignedTo: user._id,
                category: 'Backend',
                tags: ['blog', 'ecommerce'],
                subtasks: [
                    { title: 'Post CRUD', completed: true },
                    { title: 'Product CRUD', completed: true },
                    { title: 'Comments & Reviews', completed: false },
                    { title: 'Category management', completed: true }
                ]
            },
            {
                title: 'Viết Documentation',
                description: 'Tạo tài liệu hướng dẫn sử dụng API',
                status: 'pending',
                priority: 'low',
                createdBy: user._id,
                category: 'Documentation',
                tags: ['docs'],
                subtasks: [
                    { title: 'Swagger/OpenAPI', completed: false },
                    { title: 'Postman Collection', completed: false },
                    { title: 'README.md', completed: false }
                ]
            }
        ];

        await Task.insertMany(tasks);
        console.log(`✅ Đã tạo ${tasks.length} tasks`);

        // ============ SEED POSTS ============
        console.log('\n📰 Đang tạo Posts...');
        await Post.deleteMany({}); // Clear existing

        const posts = [
            {
                title: 'Hướng dẫn Node.js cho người mới bắt đầu',
                content: `Node.js là một runtime environment cho phép chạy JavaScript ở phía server.

## Tại sao nên học Node.js?
- JavaScript everywhere (Frontend + Backend)
- Non-blocking I/O, hiệu suất cao
- NPM ecosystem với hàng triệu packages
- Phù hợp cho real-time applications

## Bắt đầu như thế nào?
1. Cài đặt Node.js từ nodejs.org
2. Học JavaScript ES6+
3. Hiểu về npm và package.json
4. Xây dựng project đầu tiên!`,
                author: user._id,
                tags: ['nodejs', 'javascript', 'tutorial'],
                status: 'published',
                views: 150
            },
            {
                title: 'RESTful API Best Practices',
                content: `RESTful API là tiêu chuẩn cho web services hiện đại.

## Nguyên tắc thiết kế REST API:
1. **Use nouns, not verbs**: /users thay vì /getUsers
2. **HTTP methods đúng**: GET, POST, PUT, PATCH, DELETE
3. **Status codes phù hợp**: 200, 201, 400, 404, 500
4. **Versioning**: /api/v1/users
5. **Pagination**: ?page=1&limit=10

## Ví dụ cấu trúc endpoints:
- GET /api/products - Lấy danh sách
- POST /api/products - Tạo mới
- GET /api/products/:id - Chi tiết
- PUT /api/products/:id - Cập nhật
- DELETE /api/products/:id - Xóa`,
                author: user._id,
                tags: ['api', 'rest', 'backend'],
                status: 'published',
                views: 230
            },
            {
                title: 'MongoDB vs SQL: Khi nào nên dùng gì?',
                content: `Lựa chọn database phù hợp rất quan trọng cho dự án.

## MongoDB (NoSQL)
✅ Ưu điểm:
- Schema linh hoạt
- Scale horizontal dễ dàng
- Phù hợp cho data không cấu trúc

❌ Nhược điểm:
- Không hỗ trợ transactions phức tạp
- Không phù hợp cho data có nhiều relationships

## SQL (MySQL, PostgreSQL)
✅ Ưu điểm:
- ACID transactions
- Relationships rõ ràng
- Query phức tạp với JOIN

❌ Nhược điểm:
- Schema cứng nhắc
- Scale khó hơn`,
                author: user._id,
                tags: ['database', 'mongodb', 'sql'],
                status: 'published',
                views: 180
            },
            {
                title: 'JWT Authentication từ A đến Z',
                content: `JSON Web Token (JWT) là phương pháp xác thực phổ biến cho API.

## JWT hoạt động như thế nào?
1. User đăng nhập với email/password
2. Server verify và tạo JWT token
3. Client lưu token (localStorage/cookie)
4. Request kèm token trong header Authorization
5. Server verify token và cho phép truy cập

## Cấu trúc JWT:
- **Header**: Algorithm + Token type
- **Payload**: User data (claims)
- **Signature**: Verify token

## Best Practices:
- Đặt expiration time hợp lý
- Refresh token mechanism
- HTTPS everywhere
- Không lưu sensitive data trong payload`,
                author: user._id,
                tags: ['auth', 'jwt', 'security'],
                status: 'published',
                views: 320
            },
            {
                title: '[Draft] CI/CD Pipeline cho Node.js',
                content: `Bài viết đang được hoàn thiện...

## Nội dung dự kiến:
- GitHub Actions setup
- Docker containerization
- Testing automation
- Deploy to cloud (Vercel, Railway, Render)`,
                author: user._id,
                tags: ['devops', 'cicd'],
                status: 'draft',
                views: 0
            }
        ];

        await Post.insertMany(posts);
        console.log(`✅ Đã tạo ${posts.length} posts`);

        // ============ SUMMARY ============
        console.log('\n' + '='.repeat(50));
        console.log('🎉 SEED DATA HOÀN TẤT!');
        console.log('='.repeat(50));
        console.log(`📝 Todos: 5`);
        console.log(`📋 Tasks: 5`);
        console.log(`📰 Posts: 5`);
        console.log('='.repeat(50));

        process.exit(0);

    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seedData();
