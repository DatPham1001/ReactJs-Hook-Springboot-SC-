package com.hust.baseweb.applications.supplier.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class UpdateSupplierIM {
    private UUID supplierId;

    private String supplierName;

    private String phoneNumber;

    private String email;

    private String address;

    private List<String> categoryIds;
}
