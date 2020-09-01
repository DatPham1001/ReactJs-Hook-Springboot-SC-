export const product = {
  id: "MENU_PRODUCT",
  path: "",
  isPublic: false,
  icon: "ProductIcon",
  text: "Sản phẩm",
  child: [
    {
      id: "MENU_PRODUCT_CREATE",
      path: "/products/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới",
      child: [],
    },
    {
      id: "MENU_PRODUCT_LIST",
      path: "/products/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách",
      child: [],
    },
  ],
};
