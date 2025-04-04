package com.ecommerce.user_service.service;

import com.ecommerce.user_service.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public String validateUser(String username, String password) {
        try{
         return userRepository.validateUser(username, password);
        }
        catch(Exception e){
             log.error(e.getMessage());
             return "Unexpected Error From Service";
        }
    }
}
