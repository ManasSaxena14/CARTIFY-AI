# Cartify AI - Backend

This is the backend of the Cartify AI e-commerce platform built with Node.js, Express, and MongoDB. It provides REST APIs for managing products, users, orders, and other e-commerce functionality.

## Features

### Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- HTTP-only cookies for refresh tokens
- Password reset functionality with email verification
- Profile management and update capabilities
- Admin role management for privileged operations

### Product Management
- Create, read, update, and delete products (admin only)
- Product search and filtering by keyword, category, price range
- Product categorization and listing
- Product reviews and ratings system
- Purchase-based review validation (users can only review products they've purchased)

### AI-Powered Features
- AI product recommendations based on user prompts
- AI-powered product filtering and search
- Intelligent product suggestions using Gemini AI integration

### Shopping Cart
- Add/remove items from cart
- Update item quantities
- Calculate and maintain cart totals
- Clear entire cart functionality

### Order Management
- Order creation with shipping information
- Multiple payment methods support (Stripe, COD, UPI)
- Order tracking and status updates
- Order history for users
- Admin order management (view, update, delete)

### Admin Dashboard
- User management (view, update roles)
- Product management (create, update, delete)
- Order management (view, update status)
- Review management (view, delete)

### Additional Features
- Image upload and management with Cloudinary integration
- Email notifications and password reset emails
- Order status tracking (Processing, Shipped, Delivered)
- Inventory management with stock tracking
- Secure payment processing with Stripe integration

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Cloudinary**: Cloud-based image management
- **Stripe**: Payment processing
- **OpenAI**: AI integration for product recommendations
- **CORS**: Cross-origin resource sharing
- **Express-validator**: Request validation
- **Nodemailer**: Email sending functionality

## API Endpoints

The backend provides comprehensive REST APIs for:
- User authentication and management
- Product CRUD operations
- Shopping cart management
- Order processing
- AI-powered product recommendations
- Product reviews and ratings
- Admin operations

## Security Features

- JWT-based authentication with access/refresh tokens
- Password encryption with bcrypt
- Input validation and sanitization
- HTTP-only cookies for secure token storage
- Role-based access control (user/admin)
- Secure payment processing