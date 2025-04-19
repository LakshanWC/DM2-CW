package com.ecommerce.customer_service.repository;

import com.ecommerce.customer_service.dto.ReviewReplyDTO;
import com.ecommerce.customer_service.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review,String>{
    List<Review> findByProductId(int productId);

    Optional<Review> findByReviewId(int reviewId);

    int deleteReviewByReviewId(int reviewId);
}
