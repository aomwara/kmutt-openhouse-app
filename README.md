# KMUTT Openhouse App (AI gen Readme)

A system for managing students and activities, supporting both student and staff roles, with external APIs secured via JWT access tokens.

---

## 📝 Features

- **Student Login/Register**
  - Students can register and login using their phone number and national ID.
- **Staff Login**
  - Staff can login using username and password.
- **Role-based Access Control**
  - Different access levels for `student` and `staff`.  
  - Internal and external APIs enforce access with **auth guards**.
- **External API**
  - External clients can login and request an **accessToken (JWT)**.
  - Retrieve student data securely via external APIs.
- **Pagination & Filtering**
  - APIs support pagination and searching for student records.
- **CORS**
  - APIs allow cross-origin requests for external clients.

---

## 💻 Technology Stack

- **Frontend:** Next.js, Chakra UI v2, React  
- **Backend:** Next.js API Routes, NextAuth.js, Prisma ORM  
- **Database:** MySQL / PostgreSQL  
- **Authentication:** JWT, bcrypt  
- **Tools:** Node.js, TypeScript

---
