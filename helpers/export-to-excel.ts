import * as XLSX from "xlsx";

/**
 * Chuyển đổi một đối tượng thành một hàng phẳng (flattened) để dễ dàng xuất ra Excel
 * @param obj - Đối tượng cần chuyển đổi
 * @param prefix - Tiền tố cho khóa (dùng cho đệ quy)
 * @param current - Đối tượng hiện tại đang xử lý (dùng cho đệ quy)
 * @returns - Đối tượng đã được chuyển đổi thành dạng phẳng
 */
function flattenObject(
  obj: Record<string, any>,
  prefix: string = "",
  current: Record<string, any> = {}
): Record<string, any> {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key; // Tạo khóa mới bằng cách nối tiền tố và khóa hiện tại
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, current); // Gọi đệ quy nếu giá trị là một đối tượng
    } else {
      current[newKey] = value; // Gán giá trị vào đối tượng kết quả
    }
  }
  return current;
}

/**
 * Xuất dữ liệu ra tệp Excel
 * @param data - Mảng dữ liệu cần xuất
 * @param outputPath - Đường dẫn tệp Excel đầu ra
 */
export default function exportToExcel(data: any, outputPath: string): void {
  // Chuyển đổi từng đối tượng trong mảng thành dạng phẳng
  const flattenedData = data.map((item: any) => flattenObject(item));

  // Tạo một workbook mới
  const workbook = XLSX.utils.book_new();

  // Chuyển đổi dữ liệu JSON thành một worksheet
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);

  // Thêm worksheet vào workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Xuất workbook ra tệp Excel
  XLSX.writeFile(workbook, outputPath);
  console.log(`Tệp ${outputPath} đã được tạo thành công!`);
}
