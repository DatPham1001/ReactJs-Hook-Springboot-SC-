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
public class PartyType {
    @Id
    @Column(name = "party_type_id")
    private String partyTypeId;

    @JoinColumn(name = "parent_type_id", referencedColumnName = "party_type_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private PartyType parentType;

    private boolean hasTable;

    private String description;

    @CreatedDate
    private Date createdStamp;

    @LastModifiedDate
    private Date lastUpdatedStamp;

    public PartyType(String partyTypeId, PartyType parentType, boolean hasTable, String description) {
        this.partyTypeId = partyTypeId;
        this.parentType = parentType;
        this.hasTable = hasTable;
        this.description = description;
    }

    public PartyType() {
    }

    // Note to modify this
    public enum PartyTypeEnum {
        AUTOMATED_AGENT, PERSON, PARTY_GROUP, BANK, LEGAL_ORGANIZATION, CORPORATION, CUSTOMER_GROUP
    }
}
