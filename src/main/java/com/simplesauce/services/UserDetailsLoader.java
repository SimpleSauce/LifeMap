package com.simplesauce.services;

import com.simplesauce.models.User;
import com.simplesauce.models.UserWithRoles;
import com.simplesauce.repositories.Roles;
import com.simplesauce.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * Created by everardosifuentes on 6/23/17.
 */

@Service("customUserDetailsService")
public class UserDetailsLoader implements UserDetailsService {

    private final UserRepo users;
    private final Roles roles;

    @Autowired
    public UserDetailsLoader(UserRepo users, Roles roles) {
        this.users = users;
        this.roles = roles;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = users.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("No user found for " + username);
        }

        List<String> userRoles = roles.ofUserWith(username);
        return new UserWithRoles(user, userRoles);
    }

}
