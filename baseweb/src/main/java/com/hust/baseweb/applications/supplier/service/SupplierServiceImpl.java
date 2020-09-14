package com.hust.baseweb.applications.supplier.service;

import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.repo.CategoryRepo;
import com.hust.baseweb.applications.supplier.entity.Supplier;
import com.hust.baseweb.applications.supplier.model.CreateSupplierIM;
import com.hust.baseweb.applications.supplier.model.ListSupplierOM;
import com.hust.baseweb.applications.supplier.model.UpdateSupplierIM;
import com.hust.baseweb.applications.supplier.repo.SupplierRepo;
import com.hust.baseweb.exception.ResponseFirstType;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class SupplierServiceImpl implements SupplierService {
    SupplierRepo supplierRepo;
    CategoryRepo categoryRepo;

    @Override
    public Supplier save(Supplier supplier) {
        return supplierRepo.save(supplier);
    }

    @Override
    public ResponseEntity<?> createSupplier(CreateSupplierIM supplierIM) {
        ResponseFirstType response;

        //kiểm tra xem mã code của NCC đã tồn tại trong hệ thống hay chưa
        Supplier supplier1 = supplierRepo.findByCodeAndDeletedFalse(supplierIM.getSupplierCode());
        if (supplier1 != null) {
            response = new ResponseFirstType(400);
            response.addError("supplierCode", "existed", "Mã nhà cung cấp đã tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        Supplier supplier = new Supplier();

//        List<UUID> categoryIds = new ArrayList<>();

//        for (String id : supplierIM.getCategoryIds()) {
//            categoryIds.add(UUID.fromString(id));
//        }

//        for (UUID id : categoryIds) {
//            Category category1 = categoryRepo.findByIdAndDeletedFalse(id);
//            if (category1 == null) {
//                response = new ResponseFirstType(404);
//                response.addError("categories",
//                        "not exist",
//                        "Không tìm thấy danh mục '" + category1.getName() + "'");
//                return ResponseEntity.status(response.getStatus()).body(response);
//            }
//        }

//        List<Category> categories = categoryRepo.findAllById(categoryIds);

//        for (Category category1 : categories) {
//            category1.getSuppliers().add(supplier);
//        }

//        supplier.setCategories(categories);
        supplier.setCode(supplierIM.getSupplierCode());
        supplier.setName(supplierIM.getSupplierName());
        supplier.setPhoneNumber(supplierIM.getPhoneNumber());
        supplier.setEmail(supplierIM.getEmail());
        supplier.setAddress(supplierIM.getAddress());

        supplierRepo.save(supplier);
//        categoryRepo.saveAll(categories);

        return ResponseEntity.status(201).body(supplier);
    }

    @Override
    public ResponseEntity<?> getSupplier(UUID id) {
        Supplier supplier = supplierRepo.findByIdAndDeletedFalse(id);
        ResponseFirstType response;
        if(supplier == null){
            response = new ResponseFirstType(404);
            response.addError("supplierId", "not exits", "Id không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        List<Category> categories = supplier.getCategories();
        for (Category category : categories) {
            category.setSuppliers(null);
        }
        supplier.setOrders(supplier.getOrders());
        //supplier.setCategories(categories);
        return ResponseEntity.ok().body(supplier);
    }

    @Override
    public ResponseEntity<?> updateSupplier(UpdateSupplierIM supplierIM) {
        Supplier supplier = supplierRepo.findByIdAndDeletedFalse(supplierIM.getSupplierId());
        ResponseFirstType response;
//        if (supplier1 != null) {
//            response = new ResponseFirstType(400);
//            response.addError("supplierCode", "existed", "Mã nhà cung cấp đã tồn tại");
//            return ResponseEntity.status(response.getStatus()).body(response);
//        }
        if(supplier == null) {
            response = new ResponseFirstType(404);
            response.addError("supplierId", "not exist", "id không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }


//        if(supplier == null){
//            return "not found";
//        }
//        supplierRepo.deleteSupplierCategory(supplierIM.getSupplierId());

//        List<UUID> categoryIds = new ArrayList<>();
//
//        for (String id : supplierIM.getCategoryIds()) {
//            categoryIds.add(UUID.fromString(id));
//        }
//
//        List<Category> categories = categoryRepo.findAllById(categoryIds);
//
//        for (Category category1 : categories) {
//            category1.getSuppliers().add(supplier);
//        }

//        supplier.setCategories(categories);

        Supplier supplier1 = supplierRepo.findByCodeAndDeletedFalse(supplierIM.getSupplierCode());
        if(supplier1 != null ){
            if(!supplier1.getCode().equals(supplier.getCode())) {
                response = new ResponseFirstType(400);
                response.addError("supplierCode", "existed", "Mã nhà cung cấp đã tồn tại");
                return ResponseEntity.status(response.getStatus()).body(response);
            }

        }

        supplier.setCode(supplierIM.getSupplierCode());
        supplier.setName(supplierIM.getSupplierName());
        supplier.setPhoneNumber(supplierIM.getPhoneNumber());
        supplier.setEmail(supplierIM.getEmail());
        supplier.setAddress(supplierIM.getAddress());

        supplierRepo.save(supplier);
        return ResponseEntity.ok().body("updated");
//        categoryRepo.saveAll(categories);
//        return "updated";
    }

    @Override
    public Page<ListSupplierOM> getListSupplier(Integer page, Integer limit, String search) {
        Pageable pageable = PageRequest.of(page - 1, limit,Sort.by(Sort.Direction.DESC, "last_updated_stamp"));
        return supplierRepo.getListSupplier(search, pageable);
    }

    @Override
    public ResponseEntity<?> deleteSupplier(UUID id) {
        ResponseFirstType response;
        Supplier supplier = supplierRepo.findByIdAndDeletedFalse(id);

        if (supplier == null) {
            response = new ResponseFirstType(400);
            response.addError("id", "not exist", "Nhà cung cấp không tồn tại");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        supplier.setDeleted(true);
        supplierRepo.save(supplier);

        return ResponseEntity.ok().body("Đã xoá");
    }
}
