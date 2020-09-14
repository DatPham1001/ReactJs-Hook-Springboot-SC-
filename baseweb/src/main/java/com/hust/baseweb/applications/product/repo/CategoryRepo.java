package com.hust.baseweb.applications.product.repo;

import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.model.GetCategoriesByNameOM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryRepo extends JpaRepository<Category, UUID> {

    @Query(value = "select CAST(id as varchar ) categoryId,\n" +
            "\tname categoryName,\n" +
            "\tdescription ,\n" +
            "\tcreated_stamp createdStamp,\n" +
            "\tlast_updated_stamp lastUpdatedStamp \n" +
            " from category c \n" +
            " where c.is_deleted = false \n" +
            "\t and upper(name) like concat('%',upper(?1),'%')\n",
            nativeQuery = true)
    Page<GetCategoriesByNameOM> getAllCategoriesByName(String name, Pageable pageable);
//     @Query(value = "select * from category where is_deleted = false  and category_id = ?1")
//    Category getById(int id);

    Category findByIdAndDeletedFalse(UUID categoryId);
}
