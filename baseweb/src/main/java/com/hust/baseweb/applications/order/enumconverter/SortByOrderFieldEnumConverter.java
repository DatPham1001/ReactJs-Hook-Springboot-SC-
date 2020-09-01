package com.hust.baseweb.applications.order.enumconverter;

import com.hust.baseweb.applications.order.constant.SortByOrderField;
import org.springframework.core.convert.converter.Converter;

public class SortByOrderFieldEnumConverter implements Converter<String, SortByOrderField> {

    @Override
    public SortByOrderField convert(String value) {
        return SortByOrderField.valueOf(value.toLowerCase());
    }
}
