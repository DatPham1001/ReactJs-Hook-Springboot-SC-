package com.hust.baseweb.applications.order.service;

import com.hust.baseweb.applications.order.constant.OrderStatus;
import com.hust.baseweb.applications.order.entity.OrderItem;
import com.hust.baseweb.applications.order.entity.OrderItemId;
import com.hust.baseweb.applications.order.entity.Orders;
import com.hust.baseweb.applications.order.model.CreateNewOrderItemsOM;
import com.hust.baseweb.applications.order.model.GetListOrdersOM;
import com.hust.baseweb.applications.order.model.OrderItemIM;
import com.hust.baseweb.applications.order.model.createorder.CreateOrderIM;
import com.hust.baseweb.applications.order.model.getorderdetail.GetOrderDetailOM;
import com.hust.baseweb.applications.order.model.getorderdetail.SupplierOM;
import com.hust.baseweb.applications.order.model.updateorder.UpdateOrderIM;
import com.hust.baseweb.applications.order.repo.OrderItemRepo;
import com.hust.baseweb.applications.order.repo.OrderRepo;
import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.repo.ProductRepo;
import com.hust.baseweb.applications.supplier.entity.Supplier;
import com.hust.baseweb.applications.supplier.repo.SupplierRepo;
import com.hust.baseweb.exception.ResponseFirstType;
import com.hust.baseweb.utils.Constant;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
@Transactional
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class OrderServiceImpl implements OrderService {

    private OrderRepo orderRepo;

    private OrderItemRepo orderItemRepo;

    private SupplierRepo supplierRepo;

    private ProductRepo productRepo;

    @Override
    public ResponseEntity<?> createOrder(CreateOrderIM createOrderIM) {
        ResponseFirstType response;

        if (createOrderIM.getStatus() == OrderStatus.PAID) {
            if (createOrderIM.getPaymentMethod() == null) {
                response = new ResponseFirstType(400);
                response.addError("paymentMethod", "invalid",
                        "Yêu cầu phương thức thanh toán khi đơn hàng được cập nhật trạng thái 'đã thanh toán'");
                return ResponseEntity.status(response.getStatus()).body(response);
            }
        }

        // Check supplier'existence.
        int isSupplierExist = supplierRepo.checkSupplierExistAndDeletedFalse(UUID.fromString(createOrderIM.getSupplierId()));

        if (isSupplierExist == 0) {
            response = new ResponseFirstType(404);
            response.addError("supplierId", "not exist",
                    "Nhà cung cấp không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        Orders order = new Orders();
        Supplier supplier = new Supplier();

        supplier.setId(UUID.fromString(createOrderIM.getSupplierId()));
        order.setSupplier(supplier);

        response = createAndUpdateOrderCommonTask(order, createOrderIM);

        if (response.getStatus() != 200) {
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        return ResponseEntity.status(201).body("Đã tạo");
    }

    @Override
    public ResponseEntity<?> getOrderDetail(UUID id) {
        Orders order = orderRepo.findByIdAndDeletedFalse(id);

        if (order == null) {
            ResponseFirstType response = new ResponseFirstType(404);
            response.addError("orderId", "not exist",
                    "Đơn hàng không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        GetOrderDetailOM getOrderDetailOM = new GetOrderDetailOM();
        SupplierOM supplier = new SupplierOM();
        Supplier supplier1 = order.getSupplier();

        getOrderDetailOM.setOrderItems(orderItemRepo.findAllByOrderId(order.getId()));
        getOrderDetailOM.setOrderId(order.getId());
        getOrderDetailOM.setOrderCode(order.getCode());
        getOrderDetailOM.setDiscount(order.getDiscount());
        getOrderDetailOM.setPaymentMethod(order.getPaymentMethod());
        getOrderDetailOM.setTotalPayment(order.getTotalPayment());
        getOrderDetailOM.setQuantity(order.getQuantity());
        getOrderDetailOM.setExpDeliveryDate(order.getExpDeliveryDate());
        getOrderDetailOM.setNote(order.getNote());
        getOrderDetailOM.setLastUpdatedStamp(order.getLastUpdatedStamp());
        getOrderDetailOM.setCreatedStamp(order.getCreatedStamp());

        supplier.setSupplierId(supplier1.getId());
        supplier.setSupplierName(supplier1.getName());
        supplier.setSupplierCode(supplier1.getCode());
        supplier.setPhoneNumber(supplier1.getPhoneNumber());
        supplier.setEmail(supplier1.getEmail());
        supplier.setAddress(supplier1.getAddress());

        getOrderDetailOM.setSupplier(supplier);
        getOrderDetailOM.setStatus(order.getStatus().toString());

        return ResponseEntity.ok().body(getOrderDetailOM);
    }

    @Override
    public ResponseEntity<?> deleteOrder(UUID id) {
        Orders order = orderRepo.findByIdAndDeletedFalse(id);

        if (order == null) {
            ResponseFirstType response = new ResponseFirstType(404);
            response.addError("id", "not exist",
                    "Đơn hàng không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        } else {
            if (order.getStatus() == OrderStatus.ORDER) {
                order.setDeleted(true);
                orderRepo.save(order);
                return ResponseEntity.ok().body("Đã xoá");
            } else {
                ResponseFirstType response = new ResponseFirstType(404);
                response.addError("status", "invalid",
                        "Không thể xoá đơn hàng ở trạng thái khác trạng thái 'đã đặt hàng'");
                return ResponseEntity.status(response.getStatus()).body(response);
            }
        }
    }

    @Override
    public ResponseEntity<?> getOrdersList(Integer pageSize, Integer pageNumber, String search) {
        Page<GetListOrdersOM> getListOrdersOMPage = orderRepo.getListOrders(search, PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "last_updated_stamp")));

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
        Page<GetListOrdersOM> getListOrdersOMPage = orderRepo.getListOrdersByStatus(status, PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "last_updated_stamp")));

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

    /*@Override
    public ResponseEntity<?> deleteOrders(UpdateStatusOrDeleteOrdersIM im) {
        List<Orders> orders = orderRepo.findAllByOrderIdInAndDeletedFalse(im.getOrderIds());

        for (Orders order : orders) {
            if (order.getStatus() == OrderStatus.ORDER)
                order.setDeleted(true);
        }

        orderRepo.saveAll(orders);

        return ResponseEntity.ok().body("Đã xoá");
    }

    @Override
    public ResponseEntity<?> updateStatusOrdersToCompleted(UpdateStatusOrDeleteOrdersIM im) {
        List<Orders> orders = orderRepo.findAllByOrderIdInAndDeletedFalse(im.getOrderIds());

        for (Orders order : orders) {
            order.setStatus(OrderStatus.PAID);
        }

        orderRepo.saveAll(orders);

        return ResponseEntity.ok().body("Đã cập nhật");
    }*/

    @Override
    public ResponseEntity<?> updateOrder(UUID id, UpdateOrderIM updateOrderIM) {
        ResponseFirstType response;

        if (updateOrderIM.getStatus() == OrderStatus.PAID) {
            if (updateOrderIM.getPaymentMethod() == null) {
                response = new ResponseFirstType(400);
                response.addError("paymentMethod", "invalid",
                        "Yêu cầu phương thức thanh toán khi đơn hàng được cập nhật trạng thái 'đã thanh toán'");
                return ResponseEntity.status(response.getStatus()).body(response);
            }
        }

        Orders order = orderRepo.findByIdAndDeletedFalse(id);

        if (order == null) {
            response = new ResponseFirstType(400);
            response.addError("id", "not exist",
                    "Đơn hàng không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        switch (order.getStatus()) {
            case ORDER:
                orderItemRepo.deleteItemsOfOrder(id);

                response = createAndUpdateOrderCommonTask(order, updateOrderIM);

                if (response.getStatus() != 200) {
                    return ResponseEntity.status(response.getStatus()).body(response);
                }

                break;
            case STOCKED:
                if (updateOrderIM.getStatus() == OrderStatus.ORDER) {
                    response = new ResponseFirstType(400);
                    response.addError("status", "invalid update",
                            "Không thể cập nhật đơn hàng ở trạng thái 'đã nhập kho' thành trạng thái trước đó");
                    return ResponseEntity.status(response.getStatus()).body(response);
                } else {
                    response = updateOrderCode(order, StringUtils.trimToNull(updateOrderIM.getCode()));

                    if (response.getStatus() != 200) {
                        return ResponseEntity.status(response.getStatus()).body(response);
                    }

                    // Restore the total payment before deducting the old discount.
                    order.setTotalPayment(order.getTotalPayment() + order.getDiscount());

                    if (updateOrderIM.getDiscount() < 0) {
                        order.setDiscount(0L);
                    } else if (updateOrderIM.getDiscount() > order.getTotalPayment()) {
                        order.setDiscount(order.getTotalPayment());
                    } else {
                        order.setDiscount(updateOrderIM.getDiscount());
                    }

                    order.setStatus(updateOrderIM.getStatus());
                    order.setPaymentMethod(updateOrderIM.getPaymentMethod());
                    order.setTotalPayment(order.getTotalPayment() - order.getDiscount());
                    order.setNote(StringUtils.trimToEmpty(updateOrderIM.getNote()));

                    orderRepo.save(order);
                }

                break;
            case PAID:
                response = new ResponseFirstType(400);
                response.addError("status", "invalid update",
                        "Không thể cập nhật đơn hàng đang ở trạng thái 'đã thanh toán'");
                return ResponseEntity.status(response.getStatus()).body(response);
        }

        return ResponseEntity.ok().body("Đã cập nhật");
    }

    private CreateNewOrderItemsOM createNewOrderItems(Orders order, List<OrderItemIM> orderItemIMS) {
        CreateNewOrderItemsOM response = new CreateNewOrderItemsOM();
        List<OrderItem> orderItems = new ArrayList<>();
        Set<UUID> productIds = new HashSet<>();

        int totalOrderQuantity = 0;
        long totalPayment = 0;

        for (OrderItemIM im : orderItemIMS) {
            if (productIds.contains(im.getProductId())) {
                response.getErrors().add(new ResponseFirstType.Error("productId",
                        "duplicated",
                        "Sản phẩm có id '" + im.getProductId() + "' bị trùng"));
                return response;
            } else {
                productIds.add(im.getProductId());
            }
        }

        List<UUID> productIdsExist = productRepo.checkProductsExist(productIds);

        // Detect products does not exist.
        if (productIdsExist.size() < productIds.size()) {
            for (UUID id : productIdsExist) {
                productIds.remove(id);
            }

            for (UUID id : productIds) {
                response.getErrors().add(new ResponseFirstType.Error("productId",
                        "not exist",
                        "Sản phẩm có id '" + id + "' không tồn tại"));
            }

            return response;
        }

        for (OrderItemIM im : orderItemIMS) {
            OrderItem orderItem = new OrderItem();
            Product product = new Product();
            OrderItemId id = new OrderItemId(null, product);

            product.setId(im.getProductId());

            orderItem.setId(id);
            orderItem.setPrice(im.getPrice());
            orderItem.setOrderQuantity(im.getOrderQuantity());

            orderItems.add(orderItem);

            totalOrderQuantity += orderItem.getOrderQuantity();
            totalPayment += orderItem.getPrice() * orderItem.getOrderQuantity();
        }

        response.setOrderItems(orderItems);
        response.setTotalOrderQuantity(totalOrderQuantity);
        response.setTotalPayment(totalPayment);
        return response;
    }

    private ResponseFirstType updateOrderCode(Orders order, String newCode) {
        ResponseFirstType response;

        if (newCode != null) {
            if (!newCode.equals(order.getCode())) {
                int noDupl = orderRepo.checkDuplicateCode(newCode);

                if (noDupl == 0) {
                    order.setCode(newCode);
                } else {
                    response = new ResponseFirstType(400);
                    response.addError("code", "existed",
                            "Mã đơn hàng đã tồn tại");
                    return response;
                }
            }
        }

        response = new ResponseFirstType(200);
        return response;
    }

    private ResponseFirstType createAndUpdateOrderCommonTask(Orders order, UpdateOrderIM orderIM) {
        ResponseFirstType response;

        // Update order code.
        response = updateOrderCode(order, StringUtils.trimToNull(orderIM.getCode()));

        if (response.getStatus() != 200) {
            return response;
        }

        order.setStatus(orderIM.getStatus());
        order.setPaymentMethod(orderIM.getPaymentMethod());
        order.setExpDeliveryDate(LocalDate.parse(orderIM.getExpDeliveryDate(), Constant.DATE_FORMATTER));
        order.setNote(StringUtils.trimToEmpty(orderIM.getNote()));

        // Update order items.
        List<OrderItemIM> orderItemIMS = orderIM.getOrderItems();

        // Create new order items.
        CreateNewOrderItemsOM createNewOrderItemsOM = createNewOrderItems(order, orderItemIMS);

        if (createNewOrderItemsOM.getErrors().size() > 0) {
            response = new ResponseFirstType(404);
            response.setErrors(createNewOrderItemsOM.getErrors());
            return response;
        } else {
            // Update order detail.
            if (orderIM.getDiscount() < 0) {
                order.setDiscount(0L);
            } else if (orderIM.getDiscount() > createNewOrderItemsOM.getTotalPayment()) {
                order.setDiscount(createNewOrderItemsOM.getTotalPayment());
            } else {
                order.setDiscount(orderIM.getDiscount());
            }

            order.setQuantity(createNewOrderItemsOM.getTotalOrderQuantity());
            order.setTotalPayment(createNewOrderItemsOM.getTotalPayment() - order.getDiscount());

            // Update warehouse quantity of products.
            if (orderIM.getStatus() != OrderStatus.ORDER) {
                List<UUID> productIds = orderItemIMS.stream().map(im -> im.getProductId()).collect(Collectors.toList());
                String productIdsStr = productIds.stream().map(Object::toString).collect(Collectors.joining(","));
                List<Product> products = productRepo.findAllByIds(productIds, productIdsStr);
                OrderItemIM im;
                Product product;

                int len = orderItemIMS.size();
                log.info("Size of products is the same as size of updateOrderItemIMS -> " + (products.size() == len));

                for (int i = 0; i < len; i++) {
                    im = orderItemIMS.get(i);
                    product = products.get(i);

                    product.setInventoryNumber(im.getOrderQuantity() + product.getInventoryNumber());

                    log.info("Retrieved product with id = " + product.getId() + " in order -> " + (product.getId().compareTo(im.getProductId())));
                }

                productRepo.saveAll(products);
            }
        }

        order = orderRepo.save(order);

        for (OrderItem orderItem : createNewOrderItemsOM.getOrderItems()) {
            orderItem.getId().setOrder(order);
        }

        orderItemRepo.saveAll(createNewOrderItemsOM.getOrderItems());

        response = new ResponseFirstType(200);
        return response;
    }
}
