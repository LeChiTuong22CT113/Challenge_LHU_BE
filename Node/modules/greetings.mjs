// ES Module - Export
// ES Modules sử dụng import/export

// Named exports
export function chaoHoi(ten) {
    return `Xin chào, ${ten}!`;
}

export function tamBiet(ten) {
    return `Tạm biệt, ${ten}!`;
}

export const VERSION = "1.0.0";
export const AUTHOR = "Lê Chí Tường";

// Default export 
const sinhVien = {
    mssv: "122000153",
    hoTen: "Lê Chí Tường",
    lop: "22CT113"
};

export default sinhVien;
