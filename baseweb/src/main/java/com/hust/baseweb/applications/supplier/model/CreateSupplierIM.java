package com.hust.baseweb.applications.supplier.model;

import lombok.Getter;
import lombok.Setter;


import javax.validation.constraints.NotBlank;
import java.util.List;

@Getter
@Setter
public class CreateSupplierIM {

    @NotBlank(message = "Được yêu cầu")
    private String supplierName;

    @NotBlank(message = "Được yêu cầu")
    private String supplierCode;

    @NotBlank(message = "Được yêu cầu")
    private String phoneNumber;

    @NotBlank(message = "Được yêu cầu")
    private String email;

    @NotBlank(message = "Được yêu cầu")
    private String address;

    private List<String> categoryIds;
}
