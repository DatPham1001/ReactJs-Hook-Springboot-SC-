package com.hust.baseweb.config;

import com.hust.baseweb.applications.order.enumconverter.OrderStatusEnumConverter;
import com.hust.baseweb.applications.order.enumconverter.SortByOrderFieldEnumConverter;
import com.hust.baseweb.applications.order.enumconverter.SortDirectionEnumConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //registry.addViewController("/").setViewName("index");
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new OrderStatusEnumConverter());
        registry.addConverter(new SortByOrderFieldEnumConverter());
        registry.addConverter(new SortDirectionEnumConverter());
    }
}
