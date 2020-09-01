package com.hust.baseweb.applications.product.model;

import com.hust.baseweb.applications.supplier.entity.Supplier;

import java.util.UUID;

public interface GetProductsByNameOM {
    String getProductId();
    String getProductCode();
    String getProductName();
    String getCategoryName();
    Long getPrice();
    String getLinkImg();
    Integer getWarehouseQuantity();
}
