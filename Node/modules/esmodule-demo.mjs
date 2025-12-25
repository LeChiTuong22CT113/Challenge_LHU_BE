// ES Module - Import Demo
console.log("=== ES Modules Demo ===\n");

// Import default export
import sinhVien from './greetings.mjs';

// Import named exports
import { chaoHoi, tamBiet, VERSION, AUTHOR } from './greetings.mjs';

// Hoặc import tất cả
// import * as greetings from './greetings.mjs';

console.log("Version:", VERSION);
console.log("Author:", AUTHOR);
console.log("");

console.log("Greeting functions:");
console.log(chaoHoi("Tường"));
console.log(tamBiet("Tường"));
console.log("");

console.log("Default export (sinhVien):");
console.log("MSSV:", sinhVien.mssv);
console.log("Họ tên:", sinhVien.hoTen);
console.log("Lớp:", sinhVien.lop);
