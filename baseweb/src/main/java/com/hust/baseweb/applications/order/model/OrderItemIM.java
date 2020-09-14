package com.hust.baseweb.applications.order.model;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
public class OrderItemIM {

    @NotNull(message = "Mã sản phẩm được yêu cầu")
    private UUID productId;

    @NotNull(message = "Số lượng đặt được yêu cầu")
    @Min(value = 1, message = "Số lượng đặt phải có giá trị tối thiểu là 1")
    private Integer orderQuantity;

    @NotNull(message = "Giá sản phẩm được yêu cầu")
    @Min(value = 0, message = "Giá sản phẩm là giá trị không âm")
    private Long price;
}
