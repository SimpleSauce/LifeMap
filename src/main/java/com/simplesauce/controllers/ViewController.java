package com.simplesauce.controllers;

import com.simplesauce.models.SearchConfiguration;
import com.simplesauce.models.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

  @GetMapping("/about")
  public String siteAbout() {
    return "nav/about";
  }

  @GetMapping("/")
  public String siteIndex(Model model) {
    Object user = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (!(user instanceof User)) {
      // Create a user with all the configurations set to false, we only want to see everything
      // if registered
      User notLoggedInUser = new User();
      notLoggedInUser.setConfiguration(new SearchConfiguration());
      model.addAttribute("user", notLoggedInUser);
    }else{
      model.addAttribute("user", user);
    }
    return "nav/index";
  }

  @GetMapping("/results")
  public String siteResults() {
    return "nav/results";
  }


  @GetMapping("/jobs")
  public String siteJobs() {
    return "nav/jobs";
  }

}
