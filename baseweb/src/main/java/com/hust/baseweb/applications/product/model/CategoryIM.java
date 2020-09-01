package com.hust.baseweb.applications.product.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Component
public class CategoryIM {
    private UUID categoryId;
    @NotNull(message = "Tên không được để trống")
    private String categoryName;
    private String description;
    private UUID supplierId;
    private Date lastUpdatedStamp;
    private Date createdStamp;
}