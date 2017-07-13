package com.simplesauce.controllers;

import com.simplesauce.models.SearchConfiguration;
import com.simplesauce.repositories.UserRepo;
import com.simplesauce.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

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

        return "redirect:/login";

    }


    //update profile
    @GetMapping("/profile")
    public String showEditForm(Model model) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        model.addAttribute("user", user);
        return "user/profile";
    }

    @PostMapping("/user/edit/profile")
    public @ResponseBody User updateProfile(
            @RequestParam(value="name") String name,
            @RequestParam(value="value") String value,
            @RequestParam(value="pk") Long userId,
            Model model
    ){
        User user = usersDao.findOne(userId);

        if ("username".equalsIgnoreCase(name)){
            user.setUsername(value);
        } else if ("email".equalsIgnoreCase(name)) {
            user.setEmail(value);
        }
        usersDao.save(user);
        return user;
    }

    @PostMapping("/user/search/config")
    public @ResponseBody String updateConfiguration(
            @ModelAttribute SearchConfiguration configuration
            /*@RequestParam(name = "business") Boolean business,
            @RequestParam(name = "healthcare") Boolean healthcare*/
    ) {
        /*SearchConfiguration configuration = new SearchConfiguration();
        configuration.setBusiness(business);
        configuration.setHealthcare(healthcare);*/

        System.out.println(configuration.isBusiness());
        System.out.println(configuration.isHealthcare());

        // configDao.save(configuration);

        return "";
    }

//    @PostMapping("/post/delete")
//    public String deletePost(@ModelAttribute Post post, Model model){
//        postSvc.deletePost(post.getId());
//        model.addAttribute("msg", "Your post was deleted correctly");
//        return "return the view with a success message";
//    }









}
