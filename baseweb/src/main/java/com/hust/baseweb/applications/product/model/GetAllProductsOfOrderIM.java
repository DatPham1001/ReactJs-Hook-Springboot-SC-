package com.hust.baseweb.applications.product.model;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class GetAllProductsOfOrderIM {

    @NotNull(message = "Được yêu cầu")
    List<UUID> productIds;
}
