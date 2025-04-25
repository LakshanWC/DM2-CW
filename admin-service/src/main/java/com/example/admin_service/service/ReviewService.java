package com.example.admin_service.service;


import com.example.admin_service.dto.ReviewReplyDTO;
import com.example.admin_service.model.Review;
import com.example.admin_service.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> findAllByProductId(int productId) {
        return reviewRepository.findByProductId(productId);
    }

    public Review saveReview(Review review) {
        try{
            long reviewId = reviewRepository.count();
            review.setReviewId((int) reviewId + 1);
            //System.out.println(review.getUserName());
            return reviewRepository.save(review);
            //return null;
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return null;
        }
    }

    public String addReply(ReviewReplyDTO replyDTO) {
        try{
            Optional<Review> optionalReview = reviewRepository.findByReviewId(replyDTO.getReviewId());
            if(optionalReview.isPresent()){
                Review review = optionalReview.get();
                review.setReply(replyDTO.getReply());

                reviewRepository.save(review);

                return "success";
            }
            return "Unable to add reply";
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return "Unexpected error";
        }
    }

    public String deleteReview(int reviewId) {
        try{
            if(reviewRepository.findByReviewId(reviewId).isPresent()){
                reviewRepository.deleteReviewByReviewId(reviewId);
                return "Delete success";
            }
            return "No review found with that id";
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return "Unexpected error";
        }
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll(); // Fetch all reviews
    }

}
