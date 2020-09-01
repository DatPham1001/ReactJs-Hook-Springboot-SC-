package com.hust.baseweb.applications.product.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Component
public class CreateProductIM {

    @NotBlank(message = "Được yêu cầu")
    private String productCode;

    @NotNull(message = "Được yêu cầu")
    private UUID categoryId;

    @NotNull(message = "Tên không được để trống")
    private String productName;

    @NotNull(message = "Được yêu cầu")
    @Min(value = 0, message = "Giá tiền không hợp lệ")
    private Long price;

    @NotNull(message = "Được yêu cầu")
    @Min(value = 0, message = "Số lượng không hợp lệ")
    private Integer warehouseQuantity;

    private String linkImg;

    private String description;
}
