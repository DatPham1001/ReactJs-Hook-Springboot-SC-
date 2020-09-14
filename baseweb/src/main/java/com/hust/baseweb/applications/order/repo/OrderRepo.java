package com.hust.baseweb.applications.order.repo;

import com.hust.baseweb.applications.order.entity.Orders;
import com.hust.baseweb.applications.order.model.GetListOrdersOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepo extends JpaRepository<Orders, UUID> {

    /*@Query(value = "from Orders o where o.deleted = false and o.orderId = ?1")*/
    Orders findByIdAndDeletedFalse(UUID id);

    Orders findByCodeAndDeletedFalse(String orderCode);

    @Query(value = "select cast(o.id as varchar) orderId, \n" +
            "    o.code orderCode,\n" +
            "    o.status,\n" +
            "    sup.name supplierName, \n" +
            "    o.quantity, \n" +
            "    o.total_payment totalPayment, \n" +
            "    o.exp_delivery_date expDeliveryDate,\n" +
            "    o.note \n" +
            "from orders o \n" +
            "    inner join supplier sup on o.supplier_id = sup.id \n" +
            "where o.is_deleted = false \n" +
            "    and (upper(o.code) like concat('%', upper(?1), '%') \n" +
            "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
            "or upper(cast(o.supplier_id as varchar)) like concat('%', upper(?1), '%') " +
            "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
            "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
            "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
            "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
            "    or upper(o.note) like concat('%', upper(?1), '%'))",
            countQuery = "select count(o.id)\n" +
                    "from orders o \n" +
                    "    inner join supplier sup on o.supplier_id = sup.id \n" +
                    "where o.is_deleted = false \n" +
                    "    and (upper(o.code) like concat('%', upper(?1), '%') \n" +
                    "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
                    "or upper(cast(o.supplier_id as varchar)) like concat('%', upper(?1), '%') " +
                    "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
                    "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
                    "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
                    "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
                    "    or upper(o.note) like concat('%', upper(?1), '%'))",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrders(String search, Pageable pageable);

    @Query(value = "select cast(o.id as varchar) orderId, \n" +
            "    o.code orderCode, \n" +
            "    o.status, \n" +
            "    sup.name supplierName, \n" +
            "    o.quantity,\n" +
            "    o.total_payment totalPayment,\n" +
            "    o.exp_delivery_date expDeliveryDate,\n" +
            "    o.note\n" +
            "from orders o\n" +
            "    inner join supplier sup on o.supplier_id = sup.id\n" +
            "where o.is_deleted = false and o.status = ?1",
            countQuery = "select count(o.id)\n" +
                    "from orders o\n" +
                    "    inner join supplier sup on o.supplier_id = sup.id\n" +
                    "where o.is_deleted = false and o.status = ?1",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrdersByStatus(String status, Pageable pageable);

    @Query(value = "select cast(o.id as varchar) orderId,\n" +
            "    o.code orderCode,\n" +
            "    o.status, \n" +
            "    sup.name supplierName, \n" +
            "    o.quantity,\n" +
            "    o.total_payment totalPayment, \n" +
            "    o.exp_delivery_date expDeliveryDate,\n" +
            "    o.note \n" +
            "from orders o \n" +
            "    inner join supplier sup on o.supplier_id = sup.id \n" +
            "where o.is_deleted = false and sup.is_deleted = false \n" +
            "    and (upper(o.code) like concat('%', upper(?1), '%')\n" +
            "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
            "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
            "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
            "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
            "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
            "    or upper(o.note) like concat('%', upper(?1), '%'))",
            countQuery = "select count(o.id)\n" +
                    "from orders o \n" +
                    "    inner join supplier sup on o.supplier_id = sup.id \n" +
                    "where o.is_deleted = false and sup.is_deleted = false \n" +
                    "    and (upper(o.code) like concat('%', upper(?1), '%')\n" +
                    "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
                    "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
                    "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
                    "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
                    "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
                    "    or upper(o.note) like concat('%', upper(?1), '%'))",
            nativeQuery = true)
    Page<GetListOrdersOM> getSearchingAndSortingOrdersList(String search, Pageable pageable);

    @Query(value = "select cast(o.id as varchar) orderId, \n" +
            "    o.code orderCode, \n" +
            "    o.status, \n" +
            "    sup.name supplierName, \n" +
            "    o.quantity, \n" +
            "    o.total_payment totalPayment, \n" +
            "    o.exp_delivery_date expDeliveryDate, \n" +
            "    o.note \n" +
            "from supplier sup \n" +
            "    inner join orders o on o.supplier_id = sup.id \n" +
            "where o.is_deleted = false and sup.is_deleted = false \n" +
            "    and (upper(o.code) like concat('%', upper(?1), '%') \n" +
            "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
            "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
            "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
            "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
            "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
            "    or upper(o.note) like concat('%', upper(?1), '%')) order by sup.name asc ",
            countQuery = "select count(o.id)\n" +
                    "from supplier sup \n" +
                    "    inner join orders o on o.supplier_id = sup.id \n" +
                    "where o.is_deleted = false and sup.is_deleted = false \n" +
                    "    and (upper(o.code) like concat('%', upper(?1), '%') \n" +
                    "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
                    "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
                    "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
                    "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
                    "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
                    "    or upper(o.note) like concat('%', upper(?1), '%'))",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrdersBySupplierNameASC(String search, Pageable pageable);

    @Query(value = "select cast(o.id as varchar) orderId, \n" +
            "    o.code orderCode, \n" +
            "    o.status, \n" +
            "    sup.name supplierName, \n" +
            "    o.quantity, \n" +
            "    o.total_payment totalPayment, \n" +
            "    o.exp_delivery_date expDeliveryDate, \n" +
            "    o.note \n" +
            "from supplier sup \n" +
            "    inner join orders o on o.supplier_id = sup.id \n" +
            "where o.is_deleted = false and sup.is_deleted = false \n" +
            "    and (upper(o.code) like concat('%', upper(?1), '%') \n" +
            "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
            "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
            "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
            "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
            "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
            "    or upper(o.note) like concat('%', upper(?1), '%')) order by sup.name desc ",
            countQuery = "select count(o.id)\n" +
                    "from supplier sup \n" +
                    "    inner join orders o on o.supplier_id = sup.id \n" +
                    "where o.is_deleted = false and sup.is_deleted = false \n" +
                    "    and (upper(o.code) like concat('%', upper(?1), '%') \n" +
                    "    or upper(o.status) like concat('%', upper(?1), '%') \n" +
                    "    or upper(sup.name) like concat('%', upper(?1), '%') \n" +
                    "    or cast(o.quantity as varchar) like concat('%', ?1, '%') \n" +
                    "    or cast(o.total_payment as varchar) like concat('%', ?1, '%') \n" +
                    "    or to_char(o.exp_delivery_date, 'DD/MM/YYYY') like concat('%', ?1, '%') \n" +
                    "    or upper(o.note) like concat('%', upper(?1), '%'))",
            nativeQuery = true)
    Page<GetListOrdersOM> getListOrdersBySupplierNameDESC(String search, Pageable pageable);

    List<Orders> findAllByIdInAndDeletedFalse(List<UUID> orderIds);

    @Query(value = "SELECT COUNT(1)\n" +
            "FROM orders\n" +
            "WHERE code = ?1 and is_deleted = false;", nativeQuery = true)
    int checkDuplicateCode(String code);
}
