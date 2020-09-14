package com.hust.baseweb.applications.order.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class UpdateStatusOrDeleteOrdersIM {
    private List<UUID> orderIds;
}
