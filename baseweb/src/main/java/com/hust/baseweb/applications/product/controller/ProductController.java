package com.hust.baseweb.applications.product.controller;

import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.*;
import com.hust.baseweb.applications.product.service.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/product")
public class ProductController {
    private final ProductServiceImpl productServiceImpl;

    @Autowired
    public ProductController(ProductServiceImpl productServiceImpl) {
        this.productServiceImpl = productServiceImpl;
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody CreateProductIM createProductIM) {
        return productServiceImpl.createProduct(createProductIM);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductUpdateIM productUpdateIM , @PathVariable UUID id) {
        Product product = productServiceImpl.updateProduct(productUpdateIM,id);
        return ResponseEntity.ok().body(product);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {
        Product product = productServiceImpl.getProductById(id);
        return ResponseEntity.ok().body(product);
    }
    @GetMapping()
    public ResponseEntity<?> getAllProductByName(@RequestParam Optional<String> name,
                                                 @RequestParam Optional<Integer> page,
                                                 @RequestParam Optional<Integer> limit){
        Page<GetProductsByNameOM> products = productServiceImpl.getAllProductsByName(name.orElse(""),page.orElse(0),limit.orElse(5));
        return ResponseEntity.ok().body(products);
    }
    @GetMapping("/category")
    public ResponseEntity<?> getProductsByCategoryId(@RequestParam UUID category,
                                                     @RequestParam Optional<Integer> page,
                                                     @RequestParam Optional<Integer> limit){
        Page<GetProductsByCategoryIdOM> products = productServiceImpl.getProductsByCategoryId(category,page.orElse(0),limit.orElse(5));
        return ResponseEntity.ok().body(products);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        productServiceImpl.deleteProduct(id);
        return ResponseEntity.ok().body(HttpStatus.OK);
    }

    @PostMapping("/products-of-order")
    public ResponseEntity<?> getAllProductsOfOrder(@Valid @RequestBody GetAllProductsOfOrderIM productIds) {
        return  productServiceImpl.getAllProductsOfOrder(productIds.getProductIds());
    }
}
