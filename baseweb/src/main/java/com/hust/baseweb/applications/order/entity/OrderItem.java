package com.hust.baseweb.applications.order.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.stereotype.Component;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;

@Getter
@Setter
@Entity
@Component
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class OrderItem {

    @EmbeddedId
    private OrderItemId id;

    private Integer orderQuantity;

    private Integer importQuantity = 0;

    private Long price;
}
