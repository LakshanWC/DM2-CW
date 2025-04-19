package com.ecommerce.customer_service.service;

import com.ecommerce.customer_service.dto.FeedBackDTO;
import com.ecommerce.customer_service.dto.ReviewReplyDTO;
import com.ecommerce.customer_service.model.FeedBack;
import com.ecommerce.customer_service.model.Review;
import com.ecommerce.customer_service.repository.FeedBackRepository;
import com.ecommerce.customer_service.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedBackService {


    @Autowired
    private FeedBackRepository feedBackRepository;

    public List<FeedBack> findAllBySupplierId(String supplierId) {
        return feedBackRepository.findAllBySupplierId(supplierId);
    }

    public FeedBack saveFeedBack(FeedBack feedBack) {
        try{
            long feedBackId = feedBackRepository.count();
            feedBack.setFeedBackId((int) feedBackId + 1);
            return feedBackRepository.save(feedBack);
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return null;
        }
    }

    public String addFeedBackReply(FeedBackDTO feedBackDTO) {
        try{
            Optional<FeedBack> optionalFeedBack= feedBackRepository.findByFeedBackById(feedBackDTO.getFeedBackId());
            if(optionalFeedBack.isPresent()){
                FeedBack feedBack = optionalFeedBack.get();
                feedBack.setReply(feedBackDTO.getFeedBackReply());

                feedBackRepository.save(feedBack);

                return "success";
            }
            return "Unable to add reply";
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return "Unexpected error";
        }
    }

    public String deleteFeedBack(int feedBackId) {
        try{
            if(feedBackRepository.findByFeedBackById(feedBackId).isPresent()){
                feedBackRepository.deleteFeedBackByFeedBackId(feedBackId);
                return "Delete success";
            }
            return "No review found with that id";
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return "Unexpected error";
        }
    }
}
