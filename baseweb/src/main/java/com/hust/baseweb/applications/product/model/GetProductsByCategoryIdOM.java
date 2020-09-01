package com.hust.baseweb.applications.product.model;

import java.util.UUID;

public interface GetProductsByCategoryIdOM {
    Integer getProductId();
    UUID getCategoryId();
    String getProductName();
    UUID getSupplierId();
    Long getPrice();
    String getLinkImg();
    Integer getWarehouseQuantity();
    String getDescription();
}
