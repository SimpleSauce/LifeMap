package com.simplesauce.repositories;

import com.simplesauce.models.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepo extends CrudRepository<User, Long>{
  User findByUsername(String username);
}
