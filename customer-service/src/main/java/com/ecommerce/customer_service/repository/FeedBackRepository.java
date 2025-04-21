package com.ecommerce.customer_service.repository;

import com.ecommerce.customer_service.model.FeedBack;
import com.ecommerce.customer_service.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedBackRepository extends MongoRepository<FeedBack, String> {

    List<FeedBack> findAllBySupplierId(String supplierId);

    Optional<FeedBack> findByFeedBackId(int feedBackId);

    int deleteByFeedBackId(int feedBackId);
}
