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
    @Query(value = "select cast(id as varchar) supplierId,\n" +
                    "\tcode supplierCode,\n" +
                    "\tname supplierName, \n" +
                    "\tphone_number phoneNumber,\n" +
                    "\temail, \n" +
                    "\taddress \n" +
                    "from supplier s where is_deleted = false \n" +
                    "\tand (upper(code) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(name) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(email) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(phone_number) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(address) like upper(concat('%', ?1, '%')))",
            countQuery = "select count(id)\n" +
                    "from supplier s where is_deleted = false \n" +
                    "\tand (upper(code) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(name) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(email) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(phone_number) like upper(concat('%', ?1, '%')) \n" +
                    "\tor upper(address) like upper(concat('%', ?1, '%')))",
            nativeQuery = true)
    Page<ListSupplierOM> getListSupplier(String search, Pageable pageable);

    /*@Query(value = "from Supplier s where s.deleted = false and s.supplierId = ?1")*/
    Supplier findByIdAndDeletedFalse(UUID id);

    Supplier findByCodeAndDeletedFalse(String supplierCode);

    /*@Query(value = "update Supplier s set s.deleted = true where s.supplierId = ?1")*/
    @Transactional
    @Modifying
    @Query(value = "update supplier s set is_deleted = true where supplier_id = ?1", nativeQuery = true)
    int deleteSupplier(UUID id);

    @Modifying
    @Transactional
    @Query(value = "delete from supplier_category where supplier_id = ?1", nativeQuery = true)
    void deleteSupplierCategory(UUID id);

    @Query(value = "select count(1) from supplier s2 where id = ?1 and is_deleted = false", nativeQuery = true)
    int checkSupplierExistAndDeletedFalse(UUID id);
}
