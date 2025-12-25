// TASK 2: Module System - CommonJS
// CommonJS sử dụng require() và module.exports

// Tạo các function để export
function cong(a, b) {
    return a + b;
}

function tru(a, b) {
    return a - b;
}

function nhan(a, b) {
    return a * b;
}

function chia(a, b) {
    if (b === 0) return "Không thể chia cho 0";
    return a / b;
}

// Cách 1: Export từng function
module.exports.cong = cong;
module.exports.tru = tru;

// Cách 2: Export object
module.exports = {
    cong,
    tru,
    nhan,
    chia,
    PI: 3.14159,
    TEN_MODULE: "Máy Tính Cơ Bản"
};
