package com.example.admin_service.service;

import com.example.admin_service.dto.FeedBackReplyDTO;
import com.example.admin_service.model.FeedBack;
import com.example.admin_service.repository.FeedBackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedBackService {

    @Autowired
    private FeedBackRepository feedBackRepository;

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

    public String addReply(FeedBackReplyDTO replyDTO) {
        try{
            Optional<FeedBack> optionalFeedBack = feedBackRepository.findByFeedBackId(replyDTO.getFeedBackId());
            if(optionalFeedBack.isPresent()){
                FeedBack feedBack = optionalFeedBack.get();
                feedBack.setReply(replyDTO.getReply());
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
            if(feedBackRepository.findByFeedBackId(feedBackId).isPresent()){
                feedBackRepository.deleteFeedBackByFeedBackId(feedBackId);
                return "Delete success";
            }
            return "No feedback found with that id";
        }
        catch(Exception e){
            System.out.printf(e.getMessage());
            return "Unexpected error";
        }
    }

    public List<FeedBack> getAllFeedBacks() {
        return feedBackRepository.findAll();
    }
}