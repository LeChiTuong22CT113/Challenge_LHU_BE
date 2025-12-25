// TASK 3: Event Loop Demo
// Minh họa cách Node.js xử lý bất đồng bộ

console.log("=== Event Loop Demo ===\n");

// 1. Synchronous vs Asynchronous
console.log("1. START - Synchronous");

// setTimeout - được đưa vào Timer Queue
setTimeout(() => {
    console.log("4. setTimeout 0ms - Timer Queue");
}, 0);

// setImmediate - được đưa vào Check Queue  
setImmediate(() => {
    console.log("5. setImmediate - Check Queue");
});

// Promise - được đưa vào Microtask Queue (ưu tiên cao hơn)
Promise.resolve().then(() => {
    console.log("3. Promise.then - Microtask Queue");
});

// process.nextTick - ưu tiên cao nhất trong Microtask
process.nextTick(() => {
    console.log("2. process.nextTick - Microtask (highest priority)");
});

console.log("1. END - Synchronous");

console.log("\n--- Thứ tự thực thi ---");
console.log("Call Stack (sync) → Microtask Queue → Timer Queue → Check Queue\n");

// 2. Demo blocking vs non-blocking
console.log("=== Blocking vs Non-blocking ===");

// Non-blocking I/O
const fs = require('fs');
const path = require('path');

console.log("Bắt đầu đọc file (async)...");

fs.readFile(path.join(__dirname, 'data', 'user.json'), 'utf8', (err, data) => {
    if (err) {
        console.log("Lỗi đọc file:", err.message);
        return;
    }
    console.log("File đã đọc xong (async callback)");
});

console.log("Code này chạy TRƯỚC khi file đọc xong!");
console.log("");
