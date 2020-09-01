package com.hust.baseweb.applications.order.repo;

import com.hust.baseweb.applications.order.entity.Orders;
import com.hust.baseweb.applications.order.model.GetListOrdersOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Orders, UUID> {

    /*@Query(value = "from Orders o where o.deleted = false and o.orderId = ?1")*/
    Orders findByOrderIdAndDeletedFalse(UUID id);

    Orders findByOrderCodeAndDeletedFalse(String orderCode);

    @Query(value = "select cast(o.order_id as varchar) orderId, " +
            "o.order_code orderCode, " +
            "o.status, " +
            "sup.supplier_name supplierName, " +
            "o.quantity, " +
            "o.total_payment totalPayment, " +
            "o.exp_delivery_date expDeliveryDate, " +
            "o.note " +
            "from orders o " +
            "inner join supplier sup on o.supplier_id = sup.supplier_id " +
            "where o.is_deleted = false " +
            "and (upper(o.order_code) like concat('%', upper(?1), '%') " +
            "or upper(o.status) like concat('%', upper(?1), '%') " +
            "or upper(sup.supplier_name) like concat('%', upper(?1), '%') " +
            "or cast(o.quantity as varchar) like concat('%', ?1, '%') " +
            "or cast(o.total_payment as varchar) like concat('%', ?1, '%') " +
            "or to_char(o.exp_delivery_date, 'DD-MM-YYYY') like concat('%', ?1, '%') " +
            "or upper(o.note) like concat('%', upper(?1), '%'))",
            countQuery = "select count(o.order_id) from orders o",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrders(String search, Pageable pageable);

    @Query(value = "select cast(o.order_id as varchar) orderId, " +
            "o.order_code orderCode, " +
            "o.status, " +
            "sup.supplier_name supplierName, " +
            "o.quantity, " +
            "o.total_payment totalPayment, " +
            "o.exp_delivery_date expDeliveryDate, " +
            "o.note " +
            "from orders o " +
            "inner join supplier sup on o.supplier_id = sup.supplier_id " +
            "where o.is_deleted = false " +
            "and o.status = ?1",
            countQuery = "select count(o.order_id) from orders o",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrdersByStatus(String status, Pageable pageable);

    @Query(value = "select cast(o.order_id as varchar) orderId, " +
            "o.order_code orderCode, " +
            "o.status, " +
            "sup.supplier_name supplierName, " +
            "o.quantity, " +
            "o.total_payment totalPayment, " +
            "o.exp_delivery_date expDeliveryDate, " +
            "o.note " +
            "from orders o " +
            "inner join supplier sup on o.supplier_id = sup.supplier_id " +
            "where o.is_deleted = false and sup.is_deleted = false " +
            "and (upper(o.order_code) like concat('%', upper(?1), '%') " +
            "or upper(o.status) like concat('%', upper(?1), '%') " +
            "or upper(sup.supplier_name) like concat('%', upper(?1), '%') " +
            "or cast(o.quantity as varchar) like concat('%', ?1, '%') " +
            "or cast(o.total_payment as varchar) like concat('%', ?1, '%') " +
            "or to_char(o.exp_delivery_date, 'DD-MM-YYYY') like concat('%', ?1, '%') " +
            "or upper(o.note) like concat('%', upper(?1), '%'))",
            countQuery = "select count(o.order_id) from orders o",
            nativeQuery = true)
    Page<GetListOrdersOM> getSearchingAndSortingOrdersList(String search, Pageable pageable);

    @Query(value = "select cast(o.order_id as varchar) orderId, " +
            "o.order_code orderCode, " +
            "o.status, " +
            "sup.supplier_name supplierName, " +
            "o.quantity, " +
            "o.total_payment totalPayment, " +
            "o.exp_delivery_date expDeliveryDate, " +
            "o.note " +
            "from supplier sup " +
            "inner join orders o on o.supplier_id = sup.supplier_id " +
            "where o.is_deleted = false and sup.is_deleted = false " +
            "and (upper(o.order_code) like concat('%', upper(?1), '%') " +
            "or upper(o.status) like concat('%', upper(?1), '%') " +
            "or upper(sup.supplier_name) like concat('%', upper(?1), '%') " +
            "or cast(o.quantity as varchar) like concat('%', ?1, '%') " +
            "or cast(o.total_payment as varchar) like concat('%', ?1, '%') " +
            "or to_char(o.exp_delivery_date, 'DD-MM-YYYY') like concat('%', ?1, '%') " +
            "or upper(o.note) like concat('%', upper(?1), '%')) order by sup.supplier_name asc ",
            countQuery = "select count(o.order_id) from orders o",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrdersBySupplierNameASC(String search, Pageable pageable);

    @Query(value = "select cast(o.order_id as varchar) orderId, " +
            "o.order_code orderCode, " +
            "o.status, " +
            "sup.supplier_name supplierName, " +
            "o.quantity, " +
            "o.total_payment totalPayment, " +
            "o.exp_delivery_date expDeliveryDate, " +
            "o.note " +
            "from supplier sup " +
            "inner join orders o on o.supplier_id = sup.supplier_id " +
            "where o.is_deleted = false and sup.is_deleted = false " +
            "and (upper(o.order_code) like concat('%', upper(?1), '%') " +
            "or upper(o.status) like concat('%', upper(?1), '%') " +
            "or upper(sup.supplier_name) like concat('%', upper(?1), '%') " +
            "or cast(o.quantity as varchar) like concat('%', ?1, '%') " +
            "or cast(o.total_payment as varchar) like concat('%', ?1, '%') " +
            "or to_char(o.exp_delivery_date, 'DD-MM-YYYY') like concat('%', ?1, '%') " +
            "or upper(o.note) like concat('%', upper(?1), '%')) order by sup.supplier_name desc ",
            countQuery = "select count(o.order_id) from orders o",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrdersBySupplierNameDESC(String search, Pageable pageable);
}
