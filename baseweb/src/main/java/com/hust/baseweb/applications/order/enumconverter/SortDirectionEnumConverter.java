package com.hust.baseweb.applications.order.enumconverter;

import com.hust.baseweb.applications.order.constant.SortDirection;
import org.springframework.core.convert.converter.Converter;

public class SortDirectionEnumConverter implements Converter<String, SortDirection> {

    @Override
    public SortDirection convert(String source) {
        return SortDirection.valueOf(source.toUpperCase());
    }
}
