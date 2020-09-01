package com.hust.baseweb.applications.product.service;

import com.hust.baseweb.applications.product.converter.ProductConverter;
import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.*;
import com.hust.baseweb.applications.product.repo.CategoryRepo;
import com.hust.baseweb.applications.product.repo.ProductRepo;
import com.hust.baseweb.applications.supplier.repo.SupplierRepo;
import com.hust.baseweb.exception.ResponseFirstType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    private final Product product;
    private final ProductConverter productConverter;
    private final CategoryRepo categoryRepo;
    private final ProductRepo productRepo;
    private final SupplierRepo supplierRepo;

    @Autowired
    public ProductServiceImpl(Product product, ProductConverter productConverter, CategoryRepo categoryRepository, ProductRepo productRepository, SupplierRepo supplierRepo) {
        this.product = product;
        this.productConverter = productConverter;
        this.categoryRepo = categoryRepository;
        this.productRepo = productRepository;
        this.supplierRepo = supplierRepo;
    }

    @Override
    public ResponseEntity<?> createProduct(CreateProductIM createProductIM) {
        ResponseFirstType response;
        Category category = categoryRepo.findByCategoryIdAndDeletedFalse(createProductIM.getCategoryId());
        Product product = productRepo.findByProductCodeAndDeletedFalse(createProductIM.getProductCode());

        if (product != null) {
            response = new ResponseFirstType(400);

            response.addError("productCode", "existed",
                    "Mã sản phẩm đã tồn tại");

            return ResponseEntity.status(response.getStatus()).body(response);
        }

        if (category == null) {
            response = new ResponseFirstType(404);

            response.addError("categoryId", "not exist",
                    "Không tìm thấy danh mục có mã : " + createProductIM.getCategoryId());

            return ResponseEntity.status(response.getStatus()).body(response);
        }

        product = new Product();

        product.setProductCode(createProductIM.getProductCode());
        product.setCategory(category);
        product.setProductName(createProductIM.getProductName());
        product.setPrice(createProductIM.getPrice());
        product.setLinkImg(createProductIM.getLinkImg());
        product.setWarehouseQuantity(createProductIM.getWarehouseQuantity());
        product.setDescription(createProductIM.getDescription());

        productRepo.save(product);
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
    public Product updateProduct(ProductUpdateIM productUpdateIM, UUID id) {
        Category category = categoryRepo.getOne(productUpdateIM.getCategoryId());
        Product oldProduct = productRepo.getOne(id);
        oldProduct.setProductName(productUpdateIM.getProductName());
        oldProduct.setPrice(productUpdateIM.getPrice());
        oldProduct.setWarehouseQuantity(productUpdateIM.getWarehouseQuantity());
        oldProduct.setLinkImg(productUpdateIM.getLinkImg());
        oldProduct.setDescription(productUpdateIM.getDescription());
        oldProduct.setCategory(category);
        productRepo.save(oldProduct);
        return oldProduct;
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
    public Page<GetProductsByCategoryIdOM> getProductsByCategoryId(UUID uuid, int page, int limit) {

        return productRepo.getProductsByCategoryId(uuid, PageRequest.of(page, limit));
    }

    @Override
    public ResponseEntity<?> getAllProductsOfOrder(List<UUID> productIds) {
        List<Product> products = productRepo.findAllByProductIdInAndDeletedFalse(productIds);

        return ResponseEntity.ok().body(products.stream().map(p -> new GetAllProductsOfOrderOM(p.getProductId(),
                p.getProductCode(),
                p.getProductName(),
                p.getPrice(), p.
                getWarehouseQuantity())).collect(Collectors.toList()));
    }
}

