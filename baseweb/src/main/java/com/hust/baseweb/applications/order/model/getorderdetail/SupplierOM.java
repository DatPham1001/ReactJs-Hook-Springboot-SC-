package com.hust.baseweb.applications.order.model.getorderdetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierOM {

    private UUID supplierId;

    private String supplierName;

    private String supplierCode;

    private String phoneNumber;

    private String email;

    private String address;

    private boolean isDeleted;
}
