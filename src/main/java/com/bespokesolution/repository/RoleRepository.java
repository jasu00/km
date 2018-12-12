package com.bespokesolution.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bespokesolution.model.Role;

public interface RoleRepository extends MongoRepository<Role, String> {

    Role findByRole(String role);
}