// 1. Hello World
console.log("=== Hello Node.js ===");
console.log("Đây là file JS đầu tiên của em");
console.log("");

// 2. Biến 
console.log("=== Biến (Variables) ===");
let name = "Tường";
const age = 21;
var school = "LHU";

console.log("Tên:", name);
console.log("Tuổi:", age);
console.log("Trường:", school);
console.log("");

// 3. Kiểu dữ liệu
console.log("=== Kiểu dữ liệu ===");
let soNguyen = 100;
let soThuc = 3.14;
let chuoi = "Hello";
let boolean = true;
let mang = [1, 2, 3];
let doiTuong = { x: 1, y: 2 };

console.log("Số nguyên:", soNguyen, "- Kiểu:", typeof soNguyen);
console.log("Số thực:", soThuc, "- Kiểu:", typeof soThuc);
console.log("Chuỗi:", chuoi, "- Kiểu:", typeof chuoi);
console.log("Boolean:", boolean, "- Kiểu:", typeof boolean);
console.log("Mảng:", mang, "- Kiểu:", typeof mang);
console.log("Object:", doiTuong, "- Kiểu:", typeof doiTuong);
console.log("");

// 4. Phép toán
console.log("=== Phép toán ===");
let a = 3, b = 6;
console.log(`${a} + ${b} = ${a + b}`);
console.log(`${a} - ${b} = ${a - b}`);
console.log(`${a} * ${b} = ${a * b}`);
console.log(`${a} / ${b} = ${a / b}`);
console.log(`${a} % ${b} = ${a % b}`);
console.log(`${a} ** ${b} = ${a ** b}`);
console.log("");


// 5. Object và Array
console.log("=== Object & Array ===");
const sinhVien = {
    mssv: "122000153",
    hoTen: "Lê Chí Tường",
    lop: "22CT113",
};

console.log("Sinh viên:", sinhVien.hoTen);
console.log("MSSV:", sinhVien.mssv);
console.log("Lớp:", sinhVien.lop);
console.log("");



