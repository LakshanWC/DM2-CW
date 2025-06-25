# 🛒 Full-Stack E-Commerce Platform with Oracle PL/SQL & MongoDB

An advanced e-commerce web application built with a microservices architecture. This platform separates business logic using Oracle PL/SQL and handles dynamic user-generated content such as reviews and feedback through MongoDB.

## 🚀 Features

- 👤 **Role-Based Access**: Customers and Sellers have distinct interfaces and capabilities
- 🛍️ **E-Commerce Functionality**:
  - Product listings
  - Add to cart & place orders
  - Checkout and transactional state handling
- 📦 **Order Management**: Inventory and orders managed through stored procedures
- ✍️ **Customer Reviews & Feedback**:
  - Customers can leave reviews and feedback on products
  - Feedback is stored in **MongoDB**
  - Sellers can **view and reply** to each review
- 🛡️ **Oracle-Based Business Logic**:
  - Triggers
  - Procedures
  - Cursors
  - Transactional states
- 🔐 **Oracle Security Features**:
  - Backend microservice connects to Oracle using **role-specific DB accounts**
  - Ensures proper separation of privileges and access

## 🧠 Tech Stack

- **Frontend**: React.js
- **Backend**: Java (Spring Boot Microservices)
- **Relational DB**: Oracle (business logic written in PL/SQL)
- **NoSQL DB**: MongoDB (for reviews/feedback)
- **API Layer**: REST (Spring Web)
- **Security**: Oracle DB user accounts per service

## 👨‍💻 Contributors
- [Samidu](https://github.com/SamiduSamarasinghe)
- [Lakshan](https://github.com/LakshanWC)
- [Wasath](https://github.com/Shady0101)
- [Rukshan](https://github.com/rukaboy)
