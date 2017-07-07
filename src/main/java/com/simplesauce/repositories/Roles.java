package com.simplesauce.repositories;

import com.simplesauce.models.UserRoles;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by everardosifuentes on 6/26/17.
 */
public interface Roles extends CrudRepository<UserRoles, Long>{

    // Using HQL
    @Query("select ur.role from UserRoles ur, User u where u.username=?1 and ur.userId = u.id")
    List<String> ofUserWith(String username);

}

