package com.hust.baseweb.applications.product.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Entity
@Component
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    private String code;

    private String name;

    private long price;

    private String uom;

    private String imageLink;

    private int inventoryNumber;

    private String description;

    @Column(name = "is_deleted")
    private boolean deleted;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    @CreatedDate
    private Date createdStamp;
}
