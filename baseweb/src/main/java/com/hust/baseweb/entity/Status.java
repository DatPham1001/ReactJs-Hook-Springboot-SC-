package com.hust.baseweb.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Status {
    @Id
    @Column(name = "status_id")
    private String id;

    @JoinColumn(name = "status_type_id", referencedColumnName = "status_type_id")
    @ManyToOne(fetch = FetchType.EAGER)
    private StatusType type;

    private String statusCode;

    private String sequenceId;

    private String description;

    @CreatedDate
    private Date createdStamp;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    public Status(String id, StatusType type, String statusCode, String sequenceId, String description) {
        this.id = id;
        this.type = type;
        this.statusCode = statusCode;
        this.sequenceId = sequenceId;
        this.description = description;
    }

    public Status() {
    }

    public enum StatusEnum {
        SINGLE, MARRIED, DIVORCED, PARTY_ENABLED, PARTY_DISABLED
    }
}
