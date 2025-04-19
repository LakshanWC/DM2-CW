package com.ecommerce.customer_service.dto;

public class FeedBackDTO {
    private int feedBackId;
    private String feedBackReply;

    public int getFeedBackId() {
        return feedBackId;
    }

    public void setFeedBackId(int feedBackId) {
        this.feedBackId = feedBackId;
    }

    public String getFeedBackReply() {
        return feedBackReply;
    }

    public void setFeedBackReply(String feedBackReply) {
        this.feedBackReply = feedBackReply;
    }
}
