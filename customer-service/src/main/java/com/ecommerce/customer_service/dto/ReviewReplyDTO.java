package com.ecommerce.customer_service.dto;

public class ReviewReplyDTO {
    private int reviewId;
    private String reply;

    public int getReviewId() {
        return reviewId;
    }

    public void setReviewId(int reviewId) {
        this.reviewId = reviewId;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }
}
