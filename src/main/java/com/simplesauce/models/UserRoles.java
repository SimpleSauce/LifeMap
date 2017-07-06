package com.simplesauce.models;

import javax.persistence.*;

/**
 * Created by everardosifuentes on 6/23/17.
 */

@Entity
@Table(name = "user_roles")
public class UserRoles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "role")
    private String role;



}