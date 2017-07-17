package com.simplesauce.controllers;

import com.simplesauce.models.SearchConfiguration;
import com.simplesauce.repositories.SearchConfigRepo;
import com.simplesauce.repositories.SearchResultsRepo;
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

@Controller
public class UserController {

    @Autowired
    UserRepo usersDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    SearchConfigRepo configDao;

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

    //Update Profile
    @GetMapping("/profile")
    public String showEditForm(Model model) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        user = usersDao.findOne(user.getId());

        model.addAttribute("user", user);
        SearchConfiguration configuration = user.getConfiguration();
        if (configuration == null) configuration = new SearchConfiguration();
        model.addAttribute("configuration", configuration);
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
    public String updateConfiguration(
            @ModelAttribute SearchConfiguration configuration
    ) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User editedUser = usersDao.findOne(loggedInUser.getId());
        configDao.save(configuration);
        editedUser.setConfiguration(configuration);
        usersDao.save(editedUser);
        //}
        return "redirect:/profile";
    }
}
