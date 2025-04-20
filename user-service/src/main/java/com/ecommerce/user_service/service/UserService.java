package com.ecommerce.user_service.service;

import com.ecommerce.user_service.dto.UserDTO;
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

    public String validateUser(String username, String password, String role) {
        return userRepository.validateUser(username, password, role);
    }

    public String createUser(UserDTO userDTO) {
        try {
            return userRepository.createUser(userDTO.getName(),userDTO.getEmail(),userDTO.getAddress(),
                    userDTO.getUsername(),userDTO.getPassword(),userDTO.getPhoneNo(),userDTO.getRole());
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return "Something went wrong server side";
        }
    }
}
