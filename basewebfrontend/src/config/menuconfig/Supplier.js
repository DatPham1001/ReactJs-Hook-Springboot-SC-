export const supplier = {
  id: "MENU_SUPPLIER",
  path: "",
  isPublic: false,
  icon: "SupplierIcon",
  text: "Nhà cung cấp",
  child: [
    {
      id: "MENU_SUPPLIER_CREATE",
      path: "/supplier/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới ",
      child: [],
    },
    {
      id: "MENU_SUPPLIER_LIST",
      path: "/supplier/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách",
      child: [],
    },
  ],
};
