package com.hust.baseweb.applications.order.model.getorderdetail;

import com.hust.baseweb.applications.order.constant.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class GetOrderDetailOM {
    private UUID orderId;

    private String orderCode;

    private Long discount;

    private PaymentMethod paymentMethod;

    private String status;

    private SupplierOM supplier;

    private long totalPayment;

    private int quantity;

    private LocalDate expDeliveryDate;

    private String note;

    private Date lastUpdatedStamp;

    private Date createdStamp;

    private List<OrderItemOM> orderItems;
}
