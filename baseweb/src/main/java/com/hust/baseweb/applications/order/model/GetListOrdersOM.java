package com.hust.baseweb.applications.order.model;

import java.time.LocalDate;
import java.util.UUID;

public interface GetListOrdersOM {

    UUID getOrderId();

    String getOrderCode();

    String getStatus();

    String getSupplierName();

    Integer getQuantity();

    Integer getTotalPayment();

    LocalDate getExpDeliveryDate();

    String getNote();
}
