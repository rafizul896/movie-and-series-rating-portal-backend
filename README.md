# 🛠 Backend – Movie & Series Rating & Streaming Portal

This is the **backend** of the [Movie & Series Rating & Streaming Portal](#) 🎬 – a full-featured platform for rating, reviewing, and streaming your favorite movies and series.

It is built with **Node.js**, **Express.js**, and **Prisma ORM**, and handles all major backend operations, including:

- 🔐 Secure authentication (User & Admin)
- 📚 Media Library (CRUD)
- ⭐ Review and rating system
- 💳 Payment integration for Buy/Rent
- 📈 Analytics and admin controls

## 🔗 Live Links

- 🚀 Frontend Repository: [movie-and-series-rating-portal-frontend](https://github.com/rafizul896/movie-and-series-rating-portal-frontend)
- 🧠 Backend Repository: [movie-and-series-rating-portal-backend](https://github.com/rafizul896/movie-and-series-rating-portal-backend)
- 🌐 Live Website: [https://your-deployed-site-url.com](https://your-deployed-site-url.com)
 
 
---

## ⚙️ Tech Stack

- **Node.js + Express.js** – REST API framework for building scalable server-side applications
- **Prisma ORM** – Type-safe and performant ORM for interacting with PostgreSQL database
- **JWT** – JSON Web Token-based secure authentication
- **Bcrypt.js** – For securely hashing and verifying passwords
- **Stripe** – For payment integration and managing subscriptions
- **jsonwebtoken** – For creating and verifying JWT tokens
- **multer** – Middleware for handling `multipart/form-data` (file uploads)
- **nodemailer** – For sending emails (e.g., for password resets or confirmations)
- **prettier** – Code formatter to maintain consistent code style
- **cloudinary** – Cloud-based storage for image and video uploads
- **cookie-parser** – Parses HTTP request cookies and makes them accessible
- **dotenv** – Loads environment variables from `.env` files into `process.env`
- **zod** – TypeScript-first schema validation with static type inference


---

## 🔐 Core Features

- 🔑 **Authentication & Authorization**  
  - Role-based login system for **Users** and **Admins**

- 🎬 **Media Library Management (CRUD)**  
  - Admins can add, update, delete, and manage movies/series with:
    - Title, Description, Genre, Director, Cast, Release Year, Platform, and Price

- 🌟 **Review & Rating System**  
  - Users can:
    - Submit/edit/delete reviews with 1–10 star ratings  
    - Add spoiler warnings and custom tags

- 💳 **Buy/Rent Functionality with Payment Integration**  
  - Secure payments via Stripe  
  - Access streaming links after purchase/rent

- 🧾 **Purchase History Tracking**  
  - Users can view a list of previously bought or rented content  
  - Streaming links remain accessible if valid

- 🛠️ **Admin Moderation Tools**  
  - Approve/unpublish/delete reviews and comments  
  - Monitor user activity and content behavior

- 📊 **Analytics Dashboard**  
  - View aggregated insights such as:
    - Most reviewed titles  
    - Top rated movies/series  
    - User engagement metrics

- 🌐 **RESTful API Design**  
  - Follows REST principles  
  - Uses proper HTTP methods (GET, POST, PUT, DELETE) and status codes

