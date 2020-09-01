package com.hust.baseweb.applications.order.model.createorder;

import com.hust.baseweb.applications.order.constant.OrderStatus;
import com.hust.baseweb.applications.order.constant.PaymentMethod;
import com.hust.baseweb.utils.Constant;
import com.hust.baseweb.validator.DateFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.ArrayList;


@Getter
@Setter
public class CreateOrderIM {

    @NotBlank(message = "Mã nhà cung cấp được yêu cầu")
    @Pattern(regexp = Constant.UUID_PATTERN, message = "Mã nhả cung cấp không hợp lệ")
    private String supplierId;

    @NotBlank(message = "Mã đơn hàng được yêu cầu")
    private String orderCode;

    @NotNull(message = "Được yêu cầu")
    @Size(min = 1, message = "Đơn hàng phải có ít nhất một sản phẩm")
    @Valid
    private ArrayList<CreateOrderItemIM> orderItems;

    @NotNull(message = "Ngày nhận hàng dự kiến được yêu cầu")
    @DateFormat(message = "Ngày phải có định dạng DD/MM/YYYY và là ngày trong tương lai")
    private String expDeliveryDate;

    private String note;

    private Long discount = 0L;

    private PaymentMethod paymentMethod;

    @NotNull(message = "Được yêu cầu")
    private OrderStatus status;
}
