package com.simplesauce.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.NotBlank;
import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {

  //=================TABLE/MODEL INFORMATION=================
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column(nullable = false, unique = true)
  @NotBlank(message = "Username can't be blank")
  private String username;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  @NotBlank(message = "Password can't be blank. That's not very secure...")
  @JsonIgnore
  private String password;

  //=================CONSTRUCTORS, GETTERS AND SETTERS=================
  public User() {
  }

  public User(String username, String password) {
    this.username = username;
    this.password = password;
  }

  public User(long id, String username, String password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  public User(User user) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.password = user.password;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

}
