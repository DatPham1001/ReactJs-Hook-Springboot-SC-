package com.hust.baseweb.applications.order.service;

import com.hust.baseweb.applications.order.model.createorder.CreateOrderIM;
import com.hust.baseweb.applications.order.model.updateorder.UpdateOrderIM;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface OrderService {
    ResponseEntity<?> createOrder(CreateOrderIM createOrderIM);

    ResponseEntity<?> getOrderDetail(UUID id);

    ResponseEntity<?> deleteOrder(UUID id);

    ResponseEntity<?> getOrdersList(Integer pageSize, Integer pageNumber, String search);

    ResponseEntity<?> getOrderListByStatus(Integer pageSize, Integer pageNumber, String status);

    ResponseEntity<?> getSearchingAndSortingOrdersList(Integer pageSize,
                                                       Integer pageNumber,
                                                       String search,
                                                       String sortBy,
                                                       String order);

    /*ResponseEntity<?> deleteOrders(UpdateStatusOrDeleteOrdersIM im);

    ResponseEntity<?> updateStatusOrdersToCompleted(UpdateStatusOrDeleteOrdersIM im);*/

    ResponseEntity<?> updateOrder(UUID id, UpdateOrderIM updateOrderIM);
}
