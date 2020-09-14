package com.hust.baseweb.applications.order.model.updateorder;

import com.hust.baseweb.applications.order.constant.OrderStatus;
import com.hust.baseweb.applications.order.constant.PaymentMethod;
import com.hust.baseweb.applications.order.model.OrderItemIM;
import com.hust.baseweb.validator.DateFormat;
import lombok.Getter;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;

@Getter
@Setter
public class UpdateOrderIM {

    @Size(max = 30, message = "Mã đơn hàng không dài quá 30 kí tự")
    String code;

    @NotNull(message = "Được yêu cầu")
    OrderStatus status;

    PaymentMethod paymentMethod;

    @NotNull(message = "Được yêu cầu")
    Long discount;

    @NotNull(message = "Ngày nhận hàng dự kiến được yêu cầu")
    @DateFormat(message = "Ngày phải có định dạng DD/MM/YYYY và là ngày trong tương lai")
    String expDeliveryDate;

    String note;

    @NotNull(message = "Được yêu cầu")
    @Size(min = 1, message = "Đơn hàng phải có ít nhất một sản phẩm")
    @Valid
    ArrayList<OrderItemIM> orderItems;
}
