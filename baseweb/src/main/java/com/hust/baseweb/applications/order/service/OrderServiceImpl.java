package com.hust.baseweb.applications.order.service;

import com.hust.baseweb.applications.order.entity.OrderItem;
import com.hust.baseweb.applications.order.entity.OrderItemId;
import com.hust.baseweb.applications.order.entity.Orders;
import com.hust.baseweb.applications.order.model.GetListOrdersOM;
import com.hust.baseweb.applications.order.model.createorder.CreateOrderIM;
import com.hust.baseweb.applications.order.model.createorder.CreateOrderItemIM;
import com.hust.baseweb.applications.order.model.getorderdetail.GetOrderDetailOM;
import com.hust.baseweb.applications.order.model.getorderdetail.SupplierOM;
import com.hust.baseweb.applications.order.repo.OrderItemRepo;
import com.hust.baseweb.applications.order.repo.OrderRepo;
import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.repo.ProductRepo;
import com.hust.baseweb.applications.supplier.entity.Supplier;
import com.hust.baseweb.applications.supplier.repo.SupplierRepo;
import com.hust.baseweb.exception.ResponseFirstType;
import com.hust.baseweb.repo.StatusRepo;
import com.hust.baseweb.utils.Constant;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Log4j2
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class OrderServiceImpl implements OrderService {

    private OrderRepo orderRepo;

    private OrderItemRepo orderItemRepo;

    private StatusRepo statusRepo;

    private SupplierRepo supplierRepo;

    private ProductRepo productRepo;

    @Override
    public ResponseEntity<?> createOrder(CreateOrderIM createOrderIM) {
        ResponseFirstType response;

        if (createOrderIM.getStatus().toString().equals("PAID")) {
            if (createOrderIM.getPaymentMethod() == null) {
                response = new ResponseFirstType(400);

                response.addError("paymentMethod", "not valid",
                        "Yêu cầu phương thức thanh toán khi đơn hàng ở trạng thái 'thanh toán'");

                return ResponseEntity.status(response.getStatus()).body(response);
            }
        }

        Orders orders = orderRepo.findByOrderCodeAndDeletedFalse(createOrderIM.getOrderCode());

        if (orders != null) {
            response = new ResponseFirstType(400);

            response.addError("orderCode", "existed",
                    "Mã đơn hàng đã tồn tại");

            return ResponseEntity.status(response.getStatus()).body(response);
        }

        Orders order = new Orders();
        Supplier supplier = supplierRepo.findBySupplierIdAndDeletedFalse(UUID.fromString(createOrderIM.getSupplierId()));

        if (supplier == null) {
            response = new ResponseFirstType(404);

            response.addError("supplierId", "not exist",
                    "Không tìm thấy nhà cung cấp có mã: " + createOrderIM.getSupplierId());

            return ResponseEntity.status(response.getStatus()).body(response);
        }

        List<OrderItem> orderItems = new ArrayList<>();
        int len = createOrderIM.getOrderItems().size();
        int totalOrderQuantity = 0;
        long totalPayment = 0;

        for (int i = 0; i < len; i++) {
            CreateOrderItemIM createOrderItem = createOrderIM.getOrderItems().get(i);
            Product product = productRepo.findByProductIdAndDeletedFalse(createOrderItem.getProductId());

            if (product == null) {
                response = new ResponseFirstType(404);

                response.addError("orderItems[" + i + "].productId", "not exist",
                        "Không tìm thấy sản phẩm có mã : " + createOrderItem.getProductId());

                return ResponseEntity.status(response.getStatus()).body(response);
            }

            OrderItem orderItem = new OrderItem();
            OrderItemId id = new OrderItemId(order, product);

            orderItem.setId(id);
            orderItem.setPrice(createOrderItem.getPrice());
            orderItem.setOrderQuantity(createOrderItem.getOrderQuantity());

            orderItems.add(orderItem);

            totalOrderQuantity += orderItem.getOrderQuantity();
            totalPayment += orderItem.getPrice()*orderItem.getOrderQuantity();
        }


        order.setOrderCode(createOrderIM.getOrderCode());
        order.setStatus(createOrderIM.getStatus());
        order.setSupplier(supplier);
        order.setPaymentMethod(createOrderIM.getPaymentMethod());
        order.setDiscount(createOrderIM.getDiscount());
        order.setTotalPayment(totalPayment - createOrderIM.getDiscount());
        order.setQuantity(totalOrderQuantity);
        order.setExpDeliveryDate(LocalDate.parse(createOrderIM.getExpDeliveryDate(), Constant.DATE_FORMATTER));
        order.setNote(createOrderIM.getNote());

        orderRepo.save(order);
        orderItemRepo.saveAll(orderItems);

        return ResponseEntity.status(201).body("Đã tạo");
    }

    @Override
    public ResponseEntity<?> getOrderDetail(UUID id) {
        Orders order = orderRepo.findByOrderIdAndDeletedFalse(id);

        if (order == null) {
            ResponseFirstType response = new ResponseFirstType(404);

            response.addError("orderId", "not exist",
                    "Không tìm thấy đơn hàng có mã: " + id);

            return ResponseEntity.status(response.getStatus()).body(response);
        }

        GetOrderDetailOM getOrderDetailOM = new GetOrderDetailOM();
        SupplierOM supplier = new SupplierOM();
        Supplier supplier1 = order.getSupplier();

        getOrderDetailOM.setOrderItems(orderItemRepo.findAllByOrderAndDeletedFalse(order.getOrderId()));
        getOrderDetailOM.setOrderId(order.getOrderId());
        getOrderDetailOM.setOrderCode(order.getOrderCode());
        getOrderDetailOM.setDiscount(order.getDiscount());
        getOrderDetailOM.setPaymentMethod(order.getPaymentMethod());
        getOrderDetailOM.setTotalPayment(order.getTotalPayment());
        getOrderDetailOM.setQuantity(order.getQuantity());
        getOrderDetailOM.setExpDeliveryDate(order.getExpDeliveryDate());
        getOrderDetailOM.setNote(order.getNote());
        getOrderDetailOM.setLastUpdatedStamp(order.getLastUpdatedStamp());
        getOrderDetailOM.setCreatedStamp(order.getCreatedStamp());

        supplier.setSupplierId(supplier1.getSupplierId());
        supplier.setSupplierName(supplier1.getSupplierName());
        supplier.setSupplierCode(supplier1.getSupplierCode());
        supplier.setPhoneNumber(supplier1.getPhoneNumber());
        supplier.setEmail(supplier1.getEmail());
        supplier.setAddress(supplier1.getAddress());

        getOrderDetailOM.setSupplier(supplier);
        getOrderDetailOM.setStatus(order.getStatus().toString());

        return ResponseEntity.ok().body(getOrderDetailOM);
    }

    @Override
    public ResponseEntity<?> deleteOrder(UUID id) {
        Orders order = orderRepo.findByOrderIdAndDeletedFalse(id);

        if (order == null) {
            ResponseFirstType response = new ResponseFirstType(404);

            response.addError("id", "not exist",
                    "Không tìm thấy đơn hàng có mã: " + id);

            return ResponseEntity.status(response.getStatus()).body(response);
        }

        order.setDeleted(true);
        orderRepo.save(order);

        return ResponseEntity.ok().body("Đã xoá");
    }

    @Override
    public ResponseEntity<?> getOrdersList(Integer pageSize, Integer pageNumber, String search) {
        Page<GetListOrdersOM> getListOrdersOMPage = orderRepo.getListOrders(search, PageRequest.of(pageNumber, pageSize));

        if (pageNumber > getListOrdersOMPage.getTotalPages()) {
            ResponseFirstType response = new ResponseFirstType(400);
            response.addError("pageNumber", "not exist", "Page not exist");

            return ResponseEntity.status(response.getStatus()).body(response);
        } else {
            return ResponseEntity.ok().body(getListOrdersOMPage);
        }
    }

    @Override
    public ResponseEntity<?> getOrderListByStatus(Integer pageSize, Integer pageNumber, String status) {
        Page<GetListOrdersOM> getListOrdersOMPage = orderRepo.getListOrdersByStatus(status, PageRequest.of(pageNumber, pageSize));

        if (pageNumber > getListOrdersOMPage.getTotalPages()) {
            ResponseFirstType response = new ResponseFirstType(400);
            response.addError("pageNumber", "not exist", "Page not exist");

            return ResponseEntity.status(response.getStatus()).body(response);
        } else {
            return ResponseEntity.ok().body(getListOrdersOMPage);
        }
    }

    @Override
    public ResponseEntity<?> getSearchingAndSortingOrdersList(Integer pageSize, Integer pageNumber, String search, String sortBy, String order) {
        Pageable pageable = null;
        Page<GetListOrdersOM> getListOrdersOMPage = null;

        if (sortBy.equals("supplier_name")) {
            if ("ASC".equals(order)) {
                getListOrdersOMPage = orderRepo.getListOrdersBySupplierNameASC(search, PageRequest.of(pageNumber, pageSize));
            } else {
                getListOrdersOMPage = orderRepo.getListOrdersBySupplierNameDESC(search, PageRequest.of(pageNumber, pageSize));
            }
        } else {
            pageable = "ASC".equals(order) ? PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, sortBy)) :
                    PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, sortBy));

            getListOrdersOMPage = orderRepo.getSearchingAndSortingOrdersList(search, pageable);
        }

        if (pageNumber > getListOrdersOMPage.getTotalPages()) {
            ResponseFirstType response = new ResponseFirstType(400);
            response.addError("pageNumber", "not exist", "Page not exist");

            return ResponseEntity.status(response.getStatus()).body(response);
        } else {
            return ResponseEntity.ok().body(getListOrdersOMPage);
        }
    }
}
