package com.hust.baseweb.applications.order.model.createorder;

import com.hust.baseweb.applications.order.model.updateorder.UpdateOrderIM;
import com.hust.baseweb.utils.Constant;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;


@Getter
@Setter
public class CreateOrderIM extends UpdateOrderIM {

    @NotBlank(message = "Mã nhà cung cấp được yêu cầu")
    @Pattern(regexp = Constant.UUID_PATTERN, message = "Mã nhả cung cấp không hợp lệ")
    private String supplierId;
}
