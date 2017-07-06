package com.simplesauce.controllers;

import com.simplesauce.repositories.UserRepo;
import com.simplesauce.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * Created by everardosifuentes on 7/5/17.
 */

@Controller
public class UserController {

    @Autowired
    UserRepo usersDao;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/login")
    public String showLoginForm() {
        return "user/login";
    }


    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "user/register";
    }

    @PostMapping("/user/register")
    public String saveUser(@ModelAttribute User user){

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usersDao.save(user);

        return "nav/results";

    }

//    @PostMapping("/user/register")
//    public String saveUser(@ModelAttribute User user) {
//
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        usersDao.save(user);
//
//        return "redirect:/login";
//    }

}
