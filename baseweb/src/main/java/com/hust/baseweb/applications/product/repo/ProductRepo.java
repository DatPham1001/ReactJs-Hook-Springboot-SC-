package com.hust.baseweb.applications.product.repo;

import com.hust.baseweb.applications.product.entity.Product;
import com.hust.baseweb.applications.product.model.GetProductsByCategoryIdOM;
import com.hust.baseweb.applications.product.model.GetProductsByNameOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ProductRepo extends JpaRepository<Product, UUID> {

    @Query(value = "select CAST(p.id as varchar) productId,\n" +
            "    code productCode,\n" +
            "    p.name productName,\n" +
            "    c.name categoryName,\n" +
            "    price,\n" +
            "uom," +
            "    image_link linkImg,\n" +
            "    inventory_number warehouseQuantity,\n" +
            "    p.is_deleted ,\n" +
            "    p.description\n" +
            "from product p left join category c on p.category_id = c.id\n" +
            "where p.is_deleted = false\n" +
            "    and(upper(p.name) like concat('%',upper(?1),'%')\n" +
            "    or upper(p.code ) like concat('%',upper(?1),'%')" +
            "    or upper(c.name ) like concat('%',upper(?1),'%'))\n" +
            "    order by p.last_updated_stamp DESC", nativeQuery = true)
    Page<GetProductsByNameOM> getProductsByName(String name, Pageable pageable);

    @Query(value = "select cast (p.id as varchar) productId,\n" +
            "    p.name productName,\n" +
            "    p.price,\n" +
            "    p.inventory_number warehouseQuantity,\n" +
            "    p.image_link linkImg\n" +
            "from product p \n" +
            "where p.category_id = ?1", nativeQuery = true)
    Page<GetProductsByCategoryIdOM> getProductsByCategoryId(UUID uuid, Pageable pageable);
//    @Query(value = "select * from product p where p.is_deleted and p.product_id = ?1")
//    Product getById(int id);

    /*@Query(value = "from Product p where p.deleted = false and p.productId = ?1")*/
    Product findByIdAndDeletedFalse(UUID id);

    Product findByCodeAndDeletedFalse(String productCode);

    List<Product> findAllByIdInAndDeletedFalse(List<UUID> productIds);

    //Delete by categoryId
    @Query(value = "UPDATE public.product\n" +
            "SET is_deleted=true\n" +
            "WHERE category_id = ?1", nativeQuery = true)
    @Transactional
    @Modifying
    void deleteAllWithCategoryId(UUID uuid);

    //Update categoryId of deleted categoryId FK in product
    @Query(value = "UPDATE public.product\n" +
            "SET category_id='cc91ed5a-e6a4-11ea-991a-005056c00001'\n" +
            "WHERE category_id = ?1", nativeQuery = true)
    @Transactional
    @Modifying
    void updateCategoryIdOfDeletedOne(UUID uuid);

    @Query(value = "select count(id) from product p where p.category_id = ?1", nativeQuery = true)
    Integer getNumberOfProduct(UUID uuid);

    @Query(value = "select p.id from Product p where p.id in :productIds")
    List<UUID> checkProductsExist(Set<UUID> productIds);

    @Query(value = "from Product p where p.id in :productIds order by find_in_set(p.id, :productIdsStr)")
    List<Product> findAllByIds(List<UUID> productIds, String productIdsStr);

    @Query(value = "select code from product",nativeQuery = true)
    List<String> getAllCode();
}
