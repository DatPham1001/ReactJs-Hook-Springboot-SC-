package com.hust.baseweb.applications.product.repo;

import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.model.GetCategoriesByNameOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryRepo extends JpaRepository<Category, UUID> {
     @Query(value = "select CAST(category_id as varchar ) categoryId ,category_name categoryName,description ,created_stamp createdStamp,last_updated_stamp lastUpdatedStamp " +
             "from category c where c.is_deleted = false and category_name like concat('%',?1,'%')", nativeQuery = true)
    Page<GetCategoriesByNameOM> getAllCategoriesByName(String name, Pageable pageable);
//     @Query(value = "select * from category where is_deleted = false  and category_id = ?1")
//    Category getById(int id);

    Category findByCategoryIdAndDeletedFalse(UUID categoryId);
}
