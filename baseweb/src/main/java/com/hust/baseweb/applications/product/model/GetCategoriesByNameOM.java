package com.hust.baseweb.applications.product.model;

import java.util.Date;
import java.util.UUID;

public interface GetCategoriesByNameOM {
    UUID getCategoryId();

    String getCategoryName();

    String getDescription();

    Date getCreatedStamp();

    Date getLastUpdatedStamp();

}
