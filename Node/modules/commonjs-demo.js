// Demo require() - CommonJS

console.log("=== CommonJS Module Demo ===\n");

// Import module tự tạo
const mathUtils = require('./mathUtils');

// Sử dụng các function từ module
console.log("Module:", mathUtils.TEN_MODULE);
console.log("PI:", mathUtils.PI);
console.log("");

console.log("Phép tính:");
console.log("5 + 3 =", mathUtils.cong(5, 3));
console.log("10 - 4 =", mathUtils.tru(10, 4));
console.log("6 * 7 =", mathUtils.nhan(6, 7));
console.log("20 / 4 =", mathUtils.chia(20, 4));
console.log("10 / 0 =", mathUtils.chia(10, 0));
console.log("");

// Import có destructuring
const { cong, nhan } = require('./mathUtils');
console.log("Destructuring import:");
console.log("100 + 200 =", cong(100, 200));
console.log("25 * 4 =", nhan(25, 4));
