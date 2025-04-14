package com.ecommerce.user_service.controller;
import com.ecommerce.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping(params = {"username","password"})
    public String validateUser(@RequestParam String username, @RequestParam String password) {
        return userService.validateUser(username, password);
    }
}
