package com.hust.baseweb.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import java.util.Date;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class ApplicationType {

    @Id
    @Column(name = "application_type_id")
    private String applicationTypeId;

    private String description;

    @CreatedDate
    private Date createdStamp;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    public ApplicationType(String applicationTypeId, String description) {
        this.applicationTypeId = applicationTypeId;
        this.description = description;
    }

    public ApplicationType() {
    }
}
