package com.ecommerce.customer_service.controller;


import com.ecommerce.customer_service.dto.FeedBackDTO;
import com.ecommerce.customer_service.dto.ReviewReplyDTO;
import com.ecommerce.customer_service.model.FeedBack;
import com.ecommerce.customer_service.model.Review;
import com.ecommerce.customer_service.service.FeedBackService;
import com.ecommerce.customer_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedBackController {


    @Autowired
    private FeedBackService feedBackService;

    @GetMapping("/{supplierId}")
    public List<FeedBack> findAllBySupplierId(@PathVariable String supplierId){
        return feedBackService.findAllBySupplierId(supplierId);
    }

    @PostMapping()
    public FeedBack saveReview(@RequestBody FeedBack feedBack){
        return feedBackService.saveFeedBack(feedBack);
    }

    @PutMapping
    public String updateReview(@RequestBody FeedBackDTO feedBackDTO){
        return feedBackService.addFeedBackReply(feedBackDTO);
    }

    @DeleteMapping("/{feedBackId}")
    public String deleteReview(@PathVariable int feedBackId){
        return feedBackService.deleteFeedBack(feedBackId);
    }
}
