// TASK 3: Promise Demo
// Promise là cách xử lý bất đồng bộ hiện đại

console.log("=== Promise Demo ===\n");

// 1. Tạo Promise cơ bản
console.log("1. Tạo Promise:");

const myPromise = new Promise((resolve, reject) => {
    const success = true;

    setTimeout(() => {
        if (success) {
            resolve("Thành công!");
        } else {
            reject("Thất bại!");
        }
    }, 1000);
});

myPromise
    .then(result => console.log("   Kết quả:", result))
    .catch(error => console.log("   Lỗi:", error));

// 2. Promise states: pending, fulfilled, rejected
console.log("\n2. Promise States:");
console.log("- Pending: đang chờ");
console.log("- Fulfilled: thành công (resolve)");
console.log("- Rejected: thất bại (reject)");

// 3. Chaining Promises
console.log("\n3. Promise Chaining:");

function buoc1() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Bước 1 hoàn thành"), 500);
    });
}

function buoc2(input) {
    return new Promise(resolve => {
        setTimeout(() => resolve(input + " → Bước 2 hoàn thành"), 500);
    });
}

function buoc3(input) {
    return new Promise(resolve => {
        setTimeout(() => resolve(input + " → Bước 3 hoàn thành"), 500);
    });
}

buoc1()
    .then(result => buoc2(result))
    .then(result => buoc3(result))
    .then(result => console.log("Chain result:", result))
    .catch(error => console.log("Chain error:", error));

// 4. Promise.all - chạy song song, đợi tất cả
console.log("\n4. Promise.all (chạy song song):");

const p1 = new Promise(resolve => setTimeout(() => resolve("API 1"), 1000));
const p2 = new Promise(resolve => setTimeout(() => resolve("API 2"), 800));
const p3 = new Promise(resolve => setTimeout(() => resolve("API 3"), 1200));

Promise.all([p1, p2, p3])
    .then(results => {
        console.log("Tất cả hoàn thành:", results);
    });

// 5. Promise.race - lấy kết quả nhanh nhất
console.log("\n5. Promise.race (lấy nhanh nhất):");

Promise.race([p1, p2, p3])
    .then(winner => {
        console.log("Nhanh nhất:", winner);
    });

// 6. Promise.allSettled - đợi tất cả (kể cả lỗi)
console.log("\n6. Promise.allSettled:");

const pSuccess = Promise.resolve("OK");
const pFail = Promise.reject("ERROR");

Promise.allSettled([pSuccess, pFail])
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index + 1}: ✓ ${result.value}`);
            } else {
                console.log(`Promise ${index + 1}: ✗ ${result.reason}`);
            }
        });
    });

// 7. Ví dụ thực tế: Fetch giả lập
console.log("\n7. Ví dụ: Fetch API giả lập");

function fakeAPI(endpoint, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (endpoint.includes('error')) {
                reject({ error: 'API Error', endpoint });
            } else {
                resolve({ data: `Response from ${endpoint}`, status: 200 });
            }
        }, delay);
    });
}

fakeAPI('/users', 800)
    .then(response => {
        console.log("API Response:", response);
        return fakeAPI('/posts', 500);
    })
    .then(response => {
        console.log("API Response:", response);
    })
    .catch(error => {
        console.log("API Error:", error);
    })
    .finally(() => {
        console.log("API calls hoàn tất!");
    });
