package com.example.admin_service.controller;

import com.example.admin_service.dto.FeedBackReplyDTO;
import com.example.admin_service.model.FeedBack;
import com.example.admin_service.service.FeedBackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
public class FeedBackController {

    @Autowired
    private FeedBackService feedBackService;

    @GetMapping
    public ResponseEntity<List<FeedBack>> getAllFeedBacks() {
        return ResponseEntity.ok(feedBackService.getAllFeedBacks());
    }

    @PostMapping()
    public FeedBack saveFeedBack(@RequestBody FeedBack feedBack){
        return feedBackService.saveFeedBack(feedBack);
    }

    @PutMapping
    public String updateFeedBack(@RequestBody FeedBackReplyDTO replyDTO){
        return feedBackService.addReply(replyDTO);
    }

    @DeleteMapping("/{feedBackId}")
    public String deleteFeedBack(@PathVariable int feedBackId){
        return feedBackService.deleteFeedBack(feedBackId);
    }
}