package com.hust.baseweb.applications.supplier.repo;

import com.hust.baseweb.applications.supplier.entity.Supplier;
import com.hust.baseweb.applications.supplier.model.ListSupplierOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface SupplierRepo extends JpaRepository<Supplier, UUID> {
    @Query(value = "select cast(supplier_id as varchar) supplierId,supplier_code supplierCode ,supplier_name supplierName, phone_number phoneNumber,email, address " +
            "from supplier s where is_deleted = false and (upper(supplier_code) like upper(concat('%', ?1, '%')) or upper(supplier_name) like upper(concat('%', ?1, '%')) or upper(email) like upper(concat('%', ?1, '%')) or upper(phone_number) like upper(concat('%', ?1, '%')) or upper(address) like upper(concat('%', ?1, '%')))",
            countQuery = "select count(*) from supplier s where is_deleted = false and (upper(supplier_code) like upper(concat('%', ?1, '%')) or upper(supplier_name) like upper(concat('%', ?1, '%')) or upper(email) like upper(concat('%', ?1, '%')) or upper(phone_number) like upper(concat('%', ?1, '%')) or upper(address) like upper(concat('%', ?1, '%'))) ",
            nativeQuery = true)
    Page<ListSupplierOM> getListSupplier(String search, Pageable pageable);

    /*@Query(value = "from Supplier s where s.deleted = false and s.supplierId = ?1")*/
    Supplier findBySupplierIdAndDeletedFalse(UUID id);

    Supplier findBySupplierCodeAndDeletedFalse(String supplierCode);

    /*@Query(value = "update Supplier s set s.deleted = true where s.supplierId = ?1")*/
    @Transactional
    @Modifying
    @Query(value = "update supplier s set is_deleted = true where supplier_id = ?1", nativeQuery = true)
    int deleteSupplier(UUID id);

    @Modifying
    @Transactional
    @Query(value = "delete from supplier_category where supplier_id = ?1", nativeQuery = true)
    void deleteSupplierCategory(UUID id);
}
