package com.ecommerce.user_service.dto;

public class UserDTO {
    String name;
    String email;
    String address;
    String username;
    String password;
    String phoneNo;
    String role;

    public String getName() {return name;}

    public void setName(String name) {this.name = name;}

    public String getEmail() {return email;}

    public void setEmail(String email) {this.email = email;}

    public String getAddress() {return address;}

    public void setAddress(String address) {this.address = address;}

    public String getUsername() {return username;}

    public void setUsername(String username) {this.username = username;}

    public String getPassword() {return password;}

    public void setPassword(String password) {this.password = password;}

    public String getPhoneNo() {return phoneNo;}

    public void setPhoneNo(String phoneNo) {this.phoneNo = phoneNo;}

    public String getRole() {return role;}

    public void setRole(String role) {this.role = role;}
}
