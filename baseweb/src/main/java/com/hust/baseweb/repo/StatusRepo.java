package com.hust.baseweb.repo;

import com.hust.baseweb.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusRepo extends JpaRepository<Status, String> {
//    @Query(value= "select status_id from status s where s.status_code = concat(',?1,')" , nativeQuery = true)
//    Status getStatusByCode(String code);
}
