package com.hust.baseweb.applications.product.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Getter
@Setter
public class ProductUpdateIM {
    private UUID categoryId;
    private UUID supplierId;
    private String productName;
    private String uom;
    private String productCode;
    private long price;
    private int warehouseQuantity;
    private String linkImg;
    private String description;
}
