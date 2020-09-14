package com.hust.baseweb.applications.product.service;

import com.hust.baseweb.applications.product.converter.ProductConverter;
import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.*;
import com.hust.baseweb.applications.product.repo.CategoryRepo;
import com.hust.baseweb.applications.product.repo.ProductRepo;
import com.hust.baseweb.applications.supplier.repo.SupplierRepo;
import com.hust.baseweb.exception.ResponseFirstType;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ProductServiceImpl implements ProductService {
    private Product product;
    private ProductConverter productConverter;
    private CategoryRepo categoryRepo;
    private ProductRepo productRepo;
    private SupplierRepo supplierRepo;

    @Override
    public ResponseEntity<?> createProduct(CreateProductIM createProductIM) {
        ResponseFirstType response;

        Product product;
        //Error productCode exist
        if (createProductIM.getProductCode() != null) {
            product = productRepo.findByCodeAndDeletedFalse(createProductIM.getProductCode());
            if (product != null) {
                response = new ResponseFirstType(400);

                response.addError("productCode", "invalid",
                        "Mã sản phẩm đã tồn tại");
                return ResponseEntity.status(response.getStatus()).body(response);
            }
        }
        if(createProductIM.getCategoryId() == null) {
            Category category = categoryRepo.getOne(UUID.fromString("cc91ed5a-e6a4-11ea-991a-005056c00001"));
            product = new Product();
            product.setCode(createProductIM.getProductCode());
            product.setCategory(category);
            product.setName(createProductIM.getProductName());
            product.setPrice(createProductIM.getPrice());
            product.setUom(createProductIM.getUom());
            product.setImageLink(createProductIM.getLinkImg());
            product.setInventoryNumber(createProductIM.getWarehouseQuantity());
            product.setDescription(createProductIM.getDescription());
            productRepo.save(product);
        }
        if(createProductIM.getCategoryId() != null) {
            Category category = categoryRepo.findByIdAndDeletedFalse(createProductIM.getCategoryId());
            product = new Product();
            product.setCode(createProductIM.getProductCode());
            product.setCategory(category);
            product.setName(createProductIM.getProductName());
            product.setPrice(createProductIM.getPrice());
            product.setUom(createProductIM.getUom());
            product.setImageLink(createProductIM.getLinkImg());
            product.setInventoryNumber(createProductIM.getWarehouseQuantity());
            product.setDescription(createProductIM.getDescription());
            productRepo.save(product);
        }

//        if (category == null) {
//            response = new ResponseFirstType(404);
//
//            response.addError("categoryId", "not exist",
//                    "Danh mục không tồn tại");
//
//            return ResponseEntity.status(response.getStatus()).body(response);
//        }

        return ResponseEntity.status(201).body("Đã tạo");
    }

    @Override
    public Product getProductById(UUID id) {
//        Product product = productRepo.getById(id);
        //Get create and last update stamp
        Product product = productRepo.getOne(id);
        return product;
    }

    @Override
    public ResponseEntity<?> updateProduct(ProductUpdateIM productUpdateIM, UUID id) {
        ResponseFirstType response;
        Product oldProduct = productRepo.getOne(id);
        Product product = productRepo.findByCodeAndDeletedFalse(productUpdateIM.getProductCode());
        if(product != null ) {
            if (!product.getCode().equals(oldProduct.getCode())) {
                response = new ResponseFirstType(400);
                response.addError("productCode", "existed", "Mã sản phẩm đã tồn tại");
                return ResponseEntity.status(response.getStatus()).body(response);
            }
        }
        Category category = categoryRepo.getOne(productUpdateIM.getCategoryId());

        oldProduct.setName(productUpdateIM.getProductName());
        oldProduct.setCode(productUpdateIM.getProductCode());
        oldProduct.setPrice(productUpdateIM.getPrice());
        oldProduct.setUom(productUpdateIM.getUom());
        oldProduct.setInventoryNumber(productUpdateIM.getWarehouseQuantity());
        oldProduct.setImageLink(productUpdateIM.getLinkImg());
        oldProduct.setDescription(productUpdateIM.getDescription());
        oldProduct.setCategory(category);
        productRepo.save(oldProduct);
        return ResponseEntity.ok().body("Updated");
    }

    @Override
    public String deleteProduct(UUID id) {
        Product product = productRepo.getOne(id);
        product.setDeleted(true);
        productRepo.save(product);
        return "Deleted";
    }


    @Override
    public Page<GetProductsByNameOM> getAllProductsByName(String name, int page, int limit) {
        Page<GetProductsByNameOM> products = productRepo.getProductsByName(name, PageRequest.of(page, limit));
        return products;
    }

    @Override
    public Page<GetProductsByCategoryIdOM> getProductsByCategoryId(UUID uuid, Integer page, Integer limit) {

        return productRepo.getProductsByCategoryId(uuid, PageRequest.of(page, limit));
    }

    @Override
    public ResponseEntity<?> getAllProductsOfOrder(List<UUID> productIds) {
        List<Product> products = productRepo.findAllByIdInAndDeletedFalse(productIds);

        return ResponseEntity.ok().body(products.stream().map(p -> new GetAllProductsOfOrderOM(p.getId(),
                p.getCode(),
                p.getName(),
                p.getPrice(),
                p.getInventoryNumber(),
                p.getUom()
        )).collect(Collectors.toList()));
    }

    @Override
    public Integer getNumberOfProduct(UUID uuid) {
        return productRepo.getNumberOfProduct(uuid);
    }
}

