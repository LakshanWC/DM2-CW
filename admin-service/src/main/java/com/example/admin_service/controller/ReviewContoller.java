package com.example.admin_service.controller;


import com.example.admin_service.dto.ReviewReplyDTO;
import com.example.admin_service.model.Review;
import com.example.admin_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class ReviewContoller {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
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
