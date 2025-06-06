package com.ecommerce.customer_service.controller;

import com.ecommerce.customer_service.dto.ReviewReplyDTO;
import com.ecommerce.customer_service.model.Review;
import com.ecommerce.customer_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewContoller {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/{productId}")
    public List<Review> findAllByProductId(@PathVariable int productId){
        return reviewService.findAllByProductId(productId);
    }

    @PostMapping()
    public Review saveReview(@RequestBody Review review){
        return reviewService.saveReview(review);
    }

    @PutMapping
    public String updateReview(@RequestBody ReviewReplyDTO replyDTO){
        return reviewService.addReply(replyDTO);
    }

    @DeleteMapping("/{reviewId}")
    public String deleteReview(@PathVariable int reviewId){
        return reviewService.deleteReview(reviewId);
    }
}
