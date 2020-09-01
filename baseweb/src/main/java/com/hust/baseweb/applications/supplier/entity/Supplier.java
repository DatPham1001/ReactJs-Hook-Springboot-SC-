package com.hust.baseweb.applications.supplier.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hust.baseweb.applications.order.entity.Orders;
import com.hust.baseweb.applications.product.entity.Category;
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
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID supplierId;

    private String supplierCode;

    private String supplierName;

    private String phoneNumber;

    private String email;

    private String address;

    @ManyToMany(mappedBy = "suppliers")
    @JsonIgnoreProperties("suppliers")
    List<Category> categories = new ArrayList<>();

    @OneToMany(mappedBy = "supplier")
    @JsonIgnoreProperties("supplier")
    List<Orders> orders;

    @Column(name = "is_deleted")
    private boolean deleted;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    @CreatedDate
    private Date createdStamp;
}
