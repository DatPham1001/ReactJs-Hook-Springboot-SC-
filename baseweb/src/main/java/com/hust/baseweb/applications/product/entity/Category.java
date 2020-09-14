package com.hust.baseweb.applications.product.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hust.baseweb.applications.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    private String description;

    @ManyToMany
    @JoinTable(
            name = "supplier_category",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "supplier_id"))
    @JsonIgnoreProperties("categories")
    List<Supplier> suppliers = new ArrayList<>();

    @Column(name = "is_deleted")
    private boolean deleted;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    @CreatedDate
    private Date createdStamp;
}
