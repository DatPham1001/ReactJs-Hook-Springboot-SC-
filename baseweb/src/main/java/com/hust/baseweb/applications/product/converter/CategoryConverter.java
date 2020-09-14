package com.hust.baseweb.applications.product.converter;

import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.model.CategoryIM;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CategoryConverter {
    //Convert 1 đối tượng DTO sang Entity
    public Category toEntity(CategoryIM categoryIM) {
        Category category = new Category();
        category.setName(categoryIM.getCategoryName());
//        categoryEntity.setEditDate(categoryDTO.getEditDate());
        category.setDescription(categoryIM.getDescription());
        return category;
    }

    //Convert 1 đối tượng Entity sang DTO
    public CategoryIM toIM(Category category) {
        CategoryIM categoryIM = new CategoryIM();
        categoryIM.setCategoryId(category.getId());
        categoryIM.setCategoryName(category.getName());
        categoryIM.setCreatedStamp(category.getCreatedStamp());
        categoryIM.setLastUpdatedStamp(category.getLastUpdatedStamp());
        categoryIM.setDescription(category.getDescription());
        return categoryIM;
    }

    //Convert List đối tượng DTO sang Entity
    public List<CategoryIM> toIM(List<Category> categories) {
        List<CategoryIM> categoryIMS = new ArrayList<>();
        if (categories.size() != 0) {
            for (int i = 0; i < categories.size(); i++) {
                categoryIMS.add(toIM(categories.get(i)));
            }
        }
        return categoryIMS;
    }

    //Convert List đối tượng Entity sang DTO
    public List<Category> toEntity(List<CategoryIM> categoryIMS) {
        List<Category> categories = new ArrayList<>();
        if (categoryIMS.size() != 0) {
            for (int i = 0; i < categoryIMS.size(); i++) {
                categories.add(toEntity(categoryIMS.get(i)));
            }
        }
        return categories;
    }

    //Convert DTO to entiy using old Entity
    public Category toEntity(CategoryIM categoryIM, Category category) {
        category.setName(categoryIM.getCategoryName());
        category.setDescription(categoryIM.getDescription());
        return category;
    }

}
