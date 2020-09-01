package com.hust.baseweb.applications.order.repo;

import com.hust.baseweb.applications.order.entity.OrderItem;
import com.hust.baseweb.applications.order.entity.OrderItemId;
import com.hust.baseweb.applications.order.model.getorderdetail.OrderItemOM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, OrderItemId> {

    @Query(value = "select cast(oi.product_id as varchar) productId, oi.order_quantity orderQuantity, oi.price from order_item oi where oi.is_deleted = false and oi.order_id = ?1", nativeQuery = true)
    List<OrderItemOM> findAllByOrderAndDeletedFalse(UUID orderId);

}
