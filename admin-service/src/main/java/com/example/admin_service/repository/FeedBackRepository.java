package com.example.admin_service.repository;

import com.example.admin_service.model.FeedBack;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedBackRepository extends MongoRepository<FeedBack,String>{
    List<FeedBack> findAll();
    Optional<FeedBack> findByFeedBackId(int feedBackId);
    int deleteFeedBackByFeedBackId(int feedBackId);
}