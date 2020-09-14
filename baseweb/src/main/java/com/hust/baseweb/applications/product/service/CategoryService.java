package com.hust.baseweb.applications.product.service;

import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.model.CategoryIM;
import com.hust.baseweb.applications.product.model.GetCategoriesByNameOM;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public interface CategoryService {
    Category createCategory(CategoryIM categoryDTO);

    Optional<CategoryIM> getCategoryById(UUID id);

    Category updateCategory(UUID id, CategoryIM categoryIM);

    String deleteCategory(UUID id, Boolean clearAllProduct);

    Page<GetCategoriesByNameOM> getAllCategoriesByName(String name, Integer page, Integer limit);
}
