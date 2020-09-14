package com.hust.baseweb.applications.product.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class GetAllProductsOfOrderOM {

    private UUID id;

    private String code;

    private String name;

    private Long price;

    private Integer quantity;

    private String uom;
}
