package com.hust.baseweb.applications.order.entity;

import com.hust.baseweb.applications.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemId implements Serializable {

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Orders order;

    @OneToOne(optional = false)
    @JoinColumn(name = "product_id")
    private Product product;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrderItemId)) return false;

        OrderItemId id = (OrderItemId) o;

        return Objects.equals(getOrder().getId(), id.getOrder().getId()) &&
                Objects.equals(getProduct().getId(), id.getProduct().getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getOrder().getId(), getProduct().getId());
    }
}
