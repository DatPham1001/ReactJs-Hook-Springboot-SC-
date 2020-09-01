package com.hust.baseweb.applications.supplier.controller;

import com.hust.baseweb.applications.supplier.model.CreateSupplierIM;
import com.hust.baseweb.applications.supplier.model.UpdateSupplierIM;
import com.hust.baseweb.applications.supplier.service.SupplierServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

@Controller
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/supplier")
public class SupplierController {
    SupplierServiceImpl supplierService;

    @PostMapping
    public ResponseEntity<?> createSupplier(@Valid @RequestBody CreateSupplierIM supplierIM) {
        return supplierService.createSupplier(supplierIM);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplier(@PathVariable("id") UUID id) {
        try {
            return ResponseEntity.ok().body(supplierService.getSupplier(id));
        } catch (Exception ex) {
            return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSupplier(@PathVariable("id") UUID id,
                                            @RequestBody UpdateSupplierIM supplierIM
    ) {
        try {
            supplierIM.setSupplierId(id);
            supplierService.updateSupplier(supplierIM);
            return ResponseEntity.ok().body("updated");
//            String mesage = supplierService.updateSupplier(supplierIM);
//            if(mesage == "updated"){
//                return ResponseEntity.ok().body(mesage);
//            }else {
//                return new ResponseEntity("id not found", HttpStatus.NOT_FOUND);
//            }

        } catch (Exception ex) {
            return new ResponseEntity(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<?> getListSupplier(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "search", required = false) String search
    ) {
        try {
            if (page != null && limit != null) {
                if (search != null) {
                    return ResponseEntity.ok().body(supplierService.getListSupplier(page, limit, search));
                } else {
                    return ResponseEntity.ok().body(supplierService.getListSupplier(page, limit, ""));
                }
            } else {
                return ResponseEntity.ok().body("");
            }

        } catch (Exception ex) {
            return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable("id") UUID id) {
        try {

            return ResponseEntity.ok().body(supplierService.deleteSupplier(id));
        } catch (Exception ex) {
            return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
