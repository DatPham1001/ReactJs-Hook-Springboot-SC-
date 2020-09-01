package com.hust.baseweb.applications.supplier.service;

import com.hust.baseweb.applications.supplier.entity.Supplier;
import com.hust.baseweb.applications.supplier.model.CreateSupplierIM;
import com.hust.baseweb.applications.supplier.model.ListSupplierOM;
import com.hust.baseweb.applications.supplier.model.UpdateSupplierIM;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface SupplierService {

    Supplier save(Supplier supplier);

    ResponseEntity<?> createSupplier(CreateSupplierIM supplier);

    Supplier getSupplier(UUID id);

    void updateSupplier(UpdateSupplierIM supplierIM);

    Page<ListSupplierOM> getListSupplier(Integer page, Integer limit, String search);

    int deleteSupplier(UUID id);
}
