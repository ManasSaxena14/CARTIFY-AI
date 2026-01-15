<div align="center">

# CARTIFY AI

### A Premium AI-Powered E-Commerce Platform

**Experience the future of online shopping with an intelligent shopping assistant, stunning UI, and seamless checkout.**

</div>

---

# PROBLEM AND SOLUTION

**Problem:** Traditional e-commerce platforms lack intelligent product discovery, making it difficult for users to find what they need. Generic interfaces and clunky checkout flows lead to cart abandonment.

**Solution:** CartifyAI leverages cutting-edge AI to provide personalized product recommendations, intelligent search filtering, and a conversational shopping assistant. Built with a premium glassmorphism UI and powered by the MERN stack, it delivers a luxury shopping experience.

---

# TOP 5 FEATURES

## 1. AI-Powered Shopping Assistant
- Real-time conversational chatbot powered by **Groq Cloud (LLaMA 3.1)**
- Get product recommendations, shipping info, and support instantly
- Smart context-aware responses tailored to your shopping needs

## 2. Intelligent Product Search and AI Filtering
- Natural language product filtering ("Show me electronics under $500")
- AI-driven recommendations based on user preferences
- Advanced keyword, category, price, and rating filters

## 3. Multi-Payment Gateway Integration
- **Stripe** for secure card payments
- **Cash on Delivery (COD)** option
- **UPI** support for Indian customers
- Real-time payment intent generation and validation

## 4. Comprehensive Admin Dashboard
- Real-time analytics with **Recharts** visualizations
- Complete CRUD operations for products, orders, users, and reviews
- Order status management (Processing → Shipped → Delivered)
- User role management and moderation tools

## 5. Premium Glassmorphism UI
- Stunning animations powered by **Framer Motion**
- Responsive design with **TailwindCSS**
- Dark/Light mode support
- Micro-interactions for enhanced user experience

---

# TECH STACK

## Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Router | Navigation |
| Axios | API Client |
| Recharts | Analytics Charts |
| Stripe.js | Payment UI |
| Lucide React | Icons |

## Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Stripe | Payment Processing |
| Cloudinary | Image Hosting |
| OpenAI SDK (Groq) | AI Integration |
| Nodemailer | Email Service |

---

# PROJECT STRUCTURE

```
CartifyAI/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth)
│   │   ├── pages/           # Route pages
│   │   └── utils/           # Utility functions
│   └── package.json
│
├── backend/                  # Express Backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth & error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Helper utilities
│   └── server.js            # Entry point
│
└── package.json             # Root package
```

---

# GETTING STARTED

## Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** (local or Atlas)
- **Stripe Account** for payments
- **Cloudinary Account** for image hosting
- **Groq API Key** for AI features

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CartifyAI.git
   cd CartifyAI
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables** (see below)

5. **Run Development Servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

# ENVIRONMENT VARIABLES

## Backend (backend/.env)

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cartifyai

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI (Groq Cloud)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Frontend (frontend/.env)

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

---

# DEPLOYMENT

## Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in Vercel dashboard

## Backend (Render)

1. Create a new Web Service on Render
2. Set the root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables

## Production URLs

| Service | URL |
|---------|-----|
| Frontend | `https://your-app.vercel.app` |
| Backend | `https://your-api.onrender.com` |

---

# ROADMAP

## Planned Features
- [ ] Wishlist functionality
- [ ] Advanced AI product recommendations based on purchase history
- [ ] Real-time order tracking with maps
- [ ] Multi-vendor marketplace support
- [ ] Mobile app (React Native)
- [ ] Voice search integration

## Known Issues
- [ ] Large image uploads may timeout on slower connections
- [ ] AI responses may be delayed during high traffic

---

# API DOCUMENTATION

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-api.onrender.com/api
```

## Endpoints Overview

| Route | Description |
|-------|-------------|
| `/api/auth` | Authentication (login, register, logout) |
| `/api/users` | User profile management |
| `/api/products` | Product CRUD and search |
| `/api/cart` | Shopping cart operations |
| `/api/orders` | Order management |
| `/api/admin` | Admin dashboard APIs |
| `/api/chat` | AI chatbot integration |
| `/api/cloud` | Image upload (Cloudinary) |
| `/api/support` | Newsletter and support |

## Authentication
All protected routes require a JWT token sent via HTTP-only cookie.

---

# SECURITY

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** using bcryptjs
- **CORS** configured for allowed origins only
- **Input Validation** with express-validator
- **Rate Limiting** recommended for production
- **Helmet.js** recommended for HTTP headers

---

# OBSERVABILITY

## Logging
- Console logging in development
- Recommend Winston/Morgan for production

## Health Check
```bash
GET /health
# Returns: { "success": true, "message": "Server is running successfully!" }
```

---

# CONTRIBUTING

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


**Cartify AI Team**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)

---

<p align="center">
  Made with Love using MERN Stack + AI
</p>
