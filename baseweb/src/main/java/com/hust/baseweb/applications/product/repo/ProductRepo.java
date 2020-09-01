package com.hust.baseweb.applications.product.repo;

import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.GetProductsByCategoryIdOM;
import com.hust.baseweb.applications.product.model.GetProductsByNameOM;
import com.hust.baseweb.applications.supplier.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {

    @Query(value = "select CAST(product_id as varchar) productId, product_code productCode,product_name productName,\n" +
            "category_name categoryName,price,link_img linkImg,warehouse_quantity warehouseQuantity,p.is_deleted ,p.description\n" +
            "from product p left join category c on p.category_id =c.category_id\n" +
            "where p.is_deleted =false \n" +
            "and upper(p.product_name) like concat('%',upper(?1),'%')\n" +
            "or p.is_deleted =false \n" +
            "and upper(c.category_name ) like concat('%',upper(?1),'%')", nativeQuery = true)
    Page<GetProductsByNameOM> getProductsByName(String name, Pageable pageable);

    @Query(value = "select  CAST(c.category_id as varchar) categoryId , category_name categoryName , product_id productId, product_name productName ," +
            "p.price,CAST(p.supplier_id as varchar) supplierId,p.link_img linkImg,p.description\n" +
            "from category c left join product p \n" +
            "on c.category_id = p.category_id \n" +
            "where c.category_id = ?1",nativeQuery = true)
    Page<GetProductsByCategoryIdOM> getProductsByCategoryId(UUID uuid , Pageable pageable);
//    @Query(value = "select * from product p where p.is_deleted and p.product_id = ?1")
//    Product getById(int id);

    /*@Query(value = "from Product p where p.deleted = false and p.productId = ?1")*/
    Product findByProductIdAndDeletedFalse(UUID id);

    Product findByProductCodeAndDeletedFalse(String productCode);
}
