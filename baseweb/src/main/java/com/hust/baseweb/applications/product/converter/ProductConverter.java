package com.hust.baseweb.applications.product.converter;

import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.CreateProductIM;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProductConverter {
    //Convert 1 đối tượng DTO sang Entity
    public Product toEntity(CreateProductIM createProductIM) {
        Product product = new Product();
        createProductIM.setProductCode(product.getProductCode());
        product.setProductName(createProductIM.getProductName());
        product.setLinkImg(createProductIM.getLinkImg());
        product.setPrice(createProductIM.getPrice());
        product.setWarehouseQuantity(createProductIM.getWarehouseQuantity());
        product.setDescription(createProductIM.getDescription());
        return product;
    }

    //Convert 1 đối tượng Entity sang DTO
    public CreateProductIM toDTO(Product product) {
        CreateProductIM createProductIM = new CreateProductIM();
        createProductIM.setProductName(product.getProductName());
        createProductIM.setLinkImg(product.getLinkImg());
        createProductIM.setDescription(product.getDescription());
        createProductIM.setPrice(product.getPrice());
        createProductIM.setWarehouseQuantity(product.getWarehouseQuantity());

//        productDTO.setCategoryId(productEntity.getCategoryEntity());
        return createProductIM;

    }

    //Conver DTO to Entity using old Entity
    public Product toEntity(CreateProductIM createProductIM, Product product) {
        product.setProductName(createProductIM.getProductName());
        product.setLinkImg(createProductIM.getLinkImg());
        product.setPrice(createProductIM.getPrice());
        product.setWarehouseQuantity(createProductIM.getWarehouseQuantity());
        product.setDescription(createProductIM.getDescription());
        return product;
    }

    //Convert List đối tượng DTO sang Entity
    public List<CreateProductIM> toDTO(List<Product> products) {
        List<CreateProductIM> createProductIMS = new ArrayList<>();
        if (products.size() != 0) {
            for (int i = 0; i < products.size(); i++) {
                createProductIMS.add(toDTO(products.get(i)));
            }
        }
        return createProductIMS;
    }

    //Convert List đối tượng Entity sang DTO
    public List<Product> toEntity(List<CreateProductIM> createProductIMS) {
        List<Product> products = new ArrayList<>();
        if (createProductIMS.size() != 0) {
            for (int i = 0; i < createProductIMS.size(); i++) {
                products.add(toEntity(createProductIMS.get(i)));
            }
        }
        return products;
    }
}
