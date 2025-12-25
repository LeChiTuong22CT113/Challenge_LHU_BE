// TASK 3: Async/Await Demo
// Cú pháp hiện đại cho Promise, dễ đọc hơn

console.log("=== Async/Await Demo ===\n");

// 1. Async function cơ bản
console.log("1.Async Function:");

async function greeting() {
    return "Xin chào từ async function!";
}

// Async function luôn trả về Promise
greeting().then(msg => console.log("  ", msg));

// 2. Await - đợi Promise resolve
console.log("\n2.Await keyword:");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function countdown() {
    console.log("Đếm ngược:");
    for (let i = 3; i > 0; i--) {
        console.log(`   ${i}...`);
        await delay(500);
    }
    console.log("Xong!");
}

// 3. Try/Catch với Async/Await
console.log("\n3.Error Handling:");

async function fetchUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve({ id, name: "Lê Chí Tường", lop: "22CT113" });
            } else {
                reject(new Error("ID không hợp lệ"));
            }
        }, 500);
    });
}

async function getUser() {
    try {
        const user = await fetchUser(1);
        console.log("User:", user);

        const invalidUser = await fetchUser(-1);
        console.log("Invalid:", invalidUser);
    } catch (error) {
        console.log("Lỗi:", error.message);
    } finally {
        console.log("Hoàn tất getUser");
    }
}

// 4. Chạy tuần tự vs Song song
console.log("\n4. Sequential vs Parallel:");

async function fetchData(name, time) {
    await delay(time);
    return `${name} (${time}ms)`;
}

// Tuần tự - tổng thời gian = tổng các delay
async function sequential() {
    console.log("Sequential start...");
    const start = Date.now();

    const a = await fetchData("A", 500);
    const b = await fetchData("B", 500);
    const c = await fetchData("C", 500);

    console.log(`Sequential done: ${a}, ${b}, ${c}`);
    console.log(`Thời gian: ${Date.now() - start}ms`);
}

// Song song - tổng thời gian = delay lớn nhất
async function parallel() {
    console.log("Parallel start...");
    const start = Date.now();

    const [a, b, c] = await Promise.all([
        fetchData("A", 500),
        fetchData("B", 500),
        fetchData("C", 500)
    ]);

    console.log(`Parallel done: ${a}, ${b}, ${c}`);
    console.log(`Thời gian: ${Date.now() - start}ms`);
}

// 5. Ví dụ thực tế: Đọc nhiều file
const fs = require('fs').promises;
const path = require('path');

async function readMultipleFiles() {
    console.log("\n5.Đọc file với Async/Await:");

    try {
        const userPath = path.join(__dirname, '..', 'modules', 'data', 'user.json');

        // Đọc file
        const content = await fs.readFile(userPath, 'utf8');
        const user = JSON.parse(content);

        console.log("Đọc user.json thành công:");
        console.log("- MSSV:", user.mssv);
        console.log("- Họ tên:", user.hoTen);

    } catch (error) {
        console.log("Lỗi đọc file:", error.message);
    }
}

// 6. Async IIFE (Immediately Invoked Function Expression)
console.log("\n6.Async IIFE:");

(async () => {
    console.log("IIFE bắt đầu");
    await delay(300);
    console.log("IIFE kết thúc");
})();

// Chạy tất cả demo
async function runAllDemos() {
    await countdown();
    await getUser();
    await sequential();
    await parallel();
    await readMultipleFiles();

    console.log("\n=== Hoàn thành Async/Await Demo! ===");
}

// Chạy sau 100ms để các log trước kịp hiện
setTimeout(runAllDemos, 100);
