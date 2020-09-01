package com.hust.baseweb.applications.order.enumconverter;

import com.hust.baseweb.applications.order.constant.OrderStatus;
import org.springframework.core.convert.converter.Converter;

public class OrderStatusEnumConverter implements Converter<String, OrderStatus> {

    @Override
    public OrderStatus convert(String value) {
        return OrderStatus.valueOf(value.toUpperCase());
    }
}
