// TASK 2: Built-in Modules Demo
// fs, path, os modules

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("=== Built-in Modules Demo ===\n");

// 1. OS Module

console.log("=== OS Module ===");
console.log("Hệ điều hành:", os.platform());
console.log("Kiến trúc CPU:", os.arch());
console.log("Hostname:", os.hostname());
console.log("Thư mục Home:", os.homedir());
console.log("Thư mục Temp:", os.tmpdir());
console.log("CPU cores:", os.cpus().length);
console.log("RAM tổng:", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), "GB");
console.log("RAM còn trống:", (os.freemem() / 1024 / 1024 / 1024).toFixed(2), "GB");
console.log("Uptime:", (os.uptime() / 3600).toFixed(2), "giờ");
console.log("");

// 2. PATH Module

console.log("=== PATH Module ===");
const filePath = "C:\\Users\\Tuong\\Documents\\project\\index.js";

console.log("File path:", filePath);
console.log("basename:", path.basename(filePath));
console.log("dirname:", path.dirname(filePath));
console.log("extname:", path.extname(filePath));
console.log("parse:", JSON.stringify(path.parse(filePath), null, 2));

// path.join - nối đường dẫn an toàn
const newPath = path.join(__dirname, 'data', 'users.json');
console.log("\npath.join demo:");
console.log("__dirname:", __dirname);
console.log("Joined path:", newPath);

// path.resolve - tạo đường dẫn tuyệt đối
console.log("path.resolve:", path.resolve('modules', 'mathUtils.js'));
console.log("");

// 3. FS Module (File System)

console.log("=== FS Module ===");

// 3.1 Tạo thư mục
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log("Đã tạo thư mục:", dataDir);
} else {
    console.log("Thư mục đã tồn tại:", dataDir);
}

// 3.2 Ghi file (Sync)
const userData = {
    mssv: "122000153",
    hoTen: "Lê Chí Tường",
    lop: "22CT113",
    createdAt: new Date().toISOString()
};

const userFilePath = path.join(dataDir, 'user.json');
fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), 'utf8');
console.log("Đã ghi file:", userFilePath);

// 3.3 Đọc file (Sync)
const readData = fs.readFileSync(userFilePath, 'utf8');
console.log("\nNội dung file user.json:");
console.log(readData);

// 3.4 Thêm nội dung vào file
const logPath = path.join(dataDir, 'log.txt');
fs.appendFileSync(logPath, `[${new Date().toLocaleString()}] App started\n`);
console.log("Đã thêm log vào:", logPath);

// 3.5 Liệt kê file trong thư mục
console.log("\nCác file trong thư mục data:");
const files = fs.readdirSync(dataDir);
files.forEach((file, index) => {
    const stats = fs.statSync(path.join(dataDir, file));
    console.log(`  ${index + 1}. ${file} (${stats.size} bytes)`);
});

// 3.6 Kiểm tra file tồn tại
console.log("\nKiểm tra file:");
console.log("user.json tồn tại?", fs.existsSync(userFilePath));
console.log("notexist.txt tồn tại?", fs.existsSync(path.join(dataDir, 'notexist.txt')));

// 3.7 FS Async với Promises (cách hiện đại)
console.log("\n=== FS Async Demo ===");

const fsPromises = require('fs').promises;

async function asyncDemo() {
    try {
        // Đọc file async
        const content = await fsPromises.readFile(userFilePath, 'utf8');
        console.log("Async read thành công!");

        // Ghi file async
        const asyncPath = path.join(dataDir, 'async-test.txt');
        await fsPromises.writeFile(asyncPath, 'Đây là file được tạo bằng async/await');
        console.log("Async write thành công:", asyncPath);
    } catch (error) {
        console.error("Lỗi:", error.message);
    }
}

asyncDemo().then(() => {

});
