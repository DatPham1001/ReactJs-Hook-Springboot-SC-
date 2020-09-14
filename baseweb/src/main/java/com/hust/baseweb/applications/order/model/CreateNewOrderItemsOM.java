package com.hust.baseweb.applications.order.model;

import com.hust.baseweb.applications.order.entity.OrderItem;
import com.hust.baseweb.exception.ResponseFirstType;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CreateNewOrderItemsOM {
    private List<OrderItem> orderItems;

    private int totalOrderQuantity = 0;

    private long totalPayment = 0;

    private List<ResponseFirstType.Error> errors = new ArrayList<>();
}
