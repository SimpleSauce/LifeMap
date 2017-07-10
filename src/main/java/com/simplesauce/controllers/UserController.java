package com.simplesauce.controllers;

import com.simplesauce.repositories.UserRepo;
import com.simplesauce.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

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
    public String saveUser(@Valid User user, Errors validation, Model model){

        if(validation.hasErrors()){
            model.addAttribute("errors", validation);
            model.addAttribute("user", user);
            return "user/register";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usersDao.save(user);

        return "nav/results";

    }


    //update profile
    @GetMapping("/posts/{id}/edit")
    public String showEditForm(@PathVariable long id, Model model) {
        // TODO: Find this post in the data source using the service
        Post post = postSvc.findOne(id);
        // TODO: Pass the post found to the view
        model.addAttribute("post", post);
        return "posts/edit";
    }

    @PostMapping("/posts/{id}/edit")
    public String editPost(@ModelAttribute Post post){
        postSvc.save(post);
        return "redirect:/posts/" + post.getId();
    }

//    @PostMapping("/post/delete")
//    public String deletePost(@ModelAttribute Post post, Model model){
//        postSvc.deletePost(post.getId());
//        model.addAttribute("msg", "Your post was deleted correctly");
//        return "return the view with a success message";
//    }









}
