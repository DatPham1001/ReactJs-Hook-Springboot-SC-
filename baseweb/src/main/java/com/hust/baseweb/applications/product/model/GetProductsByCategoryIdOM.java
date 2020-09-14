package com.hust.baseweb.applications.product.model;

import java.util.UUID;

public interface GetProductsByCategoryIdOM {
    UUID getProductId();

    String getProductName();

    Long getPrice();

    String getLinkImg();

    Integer getWarehouseQuantity();
}
