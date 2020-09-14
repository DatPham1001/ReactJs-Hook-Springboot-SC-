package com.hust.baseweb.applications.product.service;

import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.CreateProductIM;
import com.hust.baseweb.applications.product.model.GetProductsByCategoryIdOM;
import com.hust.baseweb.applications.product.model.GetProductsByNameOM;
import com.hust.baseweb.applications.product.model.ProductUpdateIM;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface ProductService {
    ResponseEntity<?> createProduct(CreateProductIM createProductIM);

    Product getProductById(UUID id);

    ResponseEntity<?> updateProduct(ProductUpdateIM productUpdateIM, UUID id);

    String deleteProduct(UUID id);

    Page<GetProductsByNameOM> getAllProductsByName(String name, int page, int limit);

    Page<GetProductsByCategoryIdOM> getProductsByCategoryId(UUID uuid, Integer page, Integer limit);

    ResponseEntity<?> getAllProductsOfOrder(List<UUID> productIds);

    Integer getNumberOfProduct(UUID uuid);
}
