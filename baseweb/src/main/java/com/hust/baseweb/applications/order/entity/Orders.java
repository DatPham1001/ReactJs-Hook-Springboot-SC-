package com.hust.baseweb.applications.order.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hust.baseweb.applications.order.constant.OrderStatus;
import com.hust.baseweb.applications.order.constant.PaymentMethod;
import com.hust.baseweb.applications.supplier.entity.Supplier;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Entity
@Component
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID orderId;

    private String orderCode;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    @JsonIgnoreProperties("orders")
    private Supplier supplier;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private Long discount;

    private long totalPayment;

    private int quantity;

    private LocalDate expDeliveryDate;

    private String note;

    @Column(name = "is_deleted")
    private boolean deleted;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    @CreatedDate
    private Date createdStamp;
}
