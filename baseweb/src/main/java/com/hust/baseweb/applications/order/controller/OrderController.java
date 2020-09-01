package com.hust.baseweb.applications.order.controller;

import com.hust.baseweb.applications.order.constant.OrderStatus;
import com.hust.baseweb.applications.order.constant.SortByOrderField;
import com.hust.baseweb.applications.order.constant.SortDirection;
import com.hust.baseweb.applications.order.model.createorder.CreateOrderIM;
import com.hust.baseweb.applications.order.service.OrderServiceImpl;
import com.hust.baseweb.utils.Constant;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.UUID;

@Log4j2
@Controller
@RequestMapping("/order")
@Validated
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class OrderController {

    private OrderServiceImpl orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderIM createOrderIM) {
        return orderService.createOrder(createOrderIM);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetailById(@PathVariable
                                                @NotBlank(message = "Mã nhà cung cấp được yêu cầu")
                                                @Pattern(regexp = Constant.UUID_PATTERN, message = "Mã nhả cung cấp không hợp lệ") String id) {
        return orderService.getOrderDetail(UUID.fromString(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderById(@PathVariable
                                             @NotBlank(message = "Mã nhà cung cấp được yêu cầu")
                                             @Pattern(regexp = Constant.UUID_PATTERN, message = "Mã nhả cung cấp không hợp lệ") String id) {
        return orderService.deleteOrder(UUID.fromString(id));
    }

    @GetMapping
    public ResponseEntity<?> getOrdersList(@RequestParam
                                           @NotNull(message = "Được yêu cầu")
                                           @Min(value = 0, message = "Kích thước trang phải là số không âm") Integer pageSize,
                                           @RequestParam
                                           @NotNull(message = "Được yêu cầu")
                                           @Min(value = 0, message = "Số trang phải là số không âm") Integer pageNumber,
                                           @RequestParam(required = false) String search) {

        if (search != null) return orderService.getOrdersList(pageSize, pageNumber, search);

        search = "";

        return orderService.getOrdersList(pageSize, pageNumber, search);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getOrderListByStatus(@RequestParam
                                                  @NotNull(message = "Được yêu cầu")
                                                  @Min(value = 0, message = "Kích thước trang phải là số không âm") Integer pageSize,
                                                  @RequestParam
                                                  @NotNull(message = "Được yêu cầu")
                                                  @Min(value = 0, message = "Số trang phải là số không âm") Integer pageNumber,
                                                  @RequestParam(required = false) OrderStatus status) {
        if (status == null) {
            return getOrdersList(pageSize, pageNumber, null);
        }

        return orderService.getOrderListByStatus(pageSize, pageNumber, status.toString());
    }

    @GetMapping("/search-and-sort")
    public ResponseEntity<?> getSearchingAndSortingOrdersList(@RequestParam
                                                              @NotNull(message = "Được yêu cầu")
                                                              @Min(value = 0, message = "Kích thước trang phải là số không âm") Integer pageSize,
                                                              @RequestParam
                                                              @NotNull(message = "Được yêu cầu")
                                                              @Min(value = 0, message = "Số trang phải là số không âm") Integer pageNumber,
                                                              @RequestParam(required = false) String search,
                                                              @RequestParam(required = false) SortByOrderField sortBy,
                                                              @RequestParam(required = false) SortDirection order) {

        if (search == null) search = "";

        if (sortBy != null) {
            if (order == null) {
                return orderService.getSearchingAndSortingOrdersList(pageSize, pageNumber, search, sortBy.toString(), "ASC");
            } else {
                return orderService.getSearchingAndSortingOrdersList(pageSize, pageNumber, search, sortBy.toString(), order.toString());
            }
        } else {
            return getOrdersList(pageSize, pageNumber, search);
        }
    }
}
