package com.hust.baseweb.applications.order.model.getorderdetail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Status {

    private String statusId;

    private String statusCode;

    private String description;
}
