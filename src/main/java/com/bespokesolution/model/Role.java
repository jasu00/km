package com.bespokesolution.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "roles")
public class Role {

    @Id
    private String _id;
    @Indexed(unique = true, direction = IndexDirection.DESCENDING, dropDups = true)

    private String role;

    public String get_id() {
        return _id;
    }

    public void setId(String _id) {
        this._id = _id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}