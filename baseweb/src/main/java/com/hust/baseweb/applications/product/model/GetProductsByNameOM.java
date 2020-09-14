package com.hust.baseweb.applications.product.model;

public interface GetProductsByNameOM {
    String getProductId();

    String getProductCode();
    String getProductName();
    String getCategoryName();
    Long getPrice();
    String getLinkImg();
    String getUom();
    Integer getWarehouseQuantity();
}
