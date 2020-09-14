package com.hust.baseweb.applications.product.controller;

import com.hust.baseweb.applications.product.entity.Category;
import com.hust.baseweb.applications.product.model.CategoryIM;
import com.hust.baseweb.applications.product.model.GetCategoriesByNameOM;
import com.hust.baseweb.applications.product.service.CategoryServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@Controller
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/category")
public class CategoryController {

    private final CategoryServiceImpl categoryService;

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryIM categoryDTO) {
        Category category = categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok().body(category);
    }

    @GetMapping
    public ResponseEntity<?> getAllCategories(@RequestParam Optional<String> name,
                                              @RequestParam Optional<Integer> page,
                                              @RequestParam Optional<Integer> limit) {
        Page<GetCategoriesByNameOM> categoryDTOs = categoryService.getAllCategoriesByName(name.orElse(""), page.orElse(0), limit.orElse(5));
        return ResponseEntity.ok().body(categoryDTOs);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<?> updateCategory(@PathVariable UUID uuid, @RequestBody CategoryIM categoryIM) {
        Category category = categoryService.updateCategory(uuid, categoryIM);
        return ResponseEntity.ok().body(category);
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<?> getCategoryById(@PathVariable UUID uuid) {
        Optional<CategoryIM> categoryIM = categoryService.getCategoryById(uuid);
        return ResponseEntity.ok().body(categoryIM);
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteCategory(@RequestParam UUID uuid,
                                            @RequestParam Boolean clear) {
        categoryService.deleteCategory(uuid, clear);
        return ResponseEntity.ok().body(HttpStatus.OK);
//        return ResponseEntity.ok(clearAllProduct);
    }
}
