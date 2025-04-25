package com.example.admin_service.repository;

import com.example.admin_service.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review,String>{
    List<Review> findAll();

    List<Review> findByProductId(int productId);

    Optional<Review> findByReviewId(int reviewId);

    int deleteReviewByReviewId(int reviewId);
}
