package com.ecommerce.customer_service.service;

import com.ecommerce.customer_service.model.Review;
import com.ecommerce.customer_service.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> findAllByProductId(int productId) {
        return reviewRepository.findByProductId(productId);
    }
}
