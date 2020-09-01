package com.hust.baseweb.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
public class SecurityGroup {
    @Id
    @Column(name = "group_id")
    private String groupId;

    private String description;

    @JoinTable(name = "SecurityGroupPermission",
            joinColumns = @JoinColumn(name = "group_id",
                    referencedColumnName = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id",
                    referencedColumnName = "permission_id"))
    @OneToMany(fetch = FetchType.LAZY)
    private List<SecurityPermission> permissions;

    @CreatedDate
    private Date createdStamp;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    public SecurityGroup() {
    }
}
