# Cartify AI - Frontend

This is the frontend of the Cartify AI e-commerce platform built with React, Vite, and Tailwind CSS. It provides a modern, responsive user interface for browsing products, managing shopping carts, and completing purchases.

## Features

### User Interface
- Responsive design that works on desktop, tablet, and mobile devices
- Modern UI with Tailwind CSS styling and smooth animations
- Glassmorphism effects and elegant transitions
- Intuitive navigation with clear user flows
- Loading states and skeleton screens for better UX

### Authentication & User Management
- User registration and login forms
- Protected routes for authenticated users
- User profile management
- Password update functionality
- Secure logout with token cleanup

### Product Catalog
- Product listing with search and filtering capabilities
- Category browsing with dedicated category pages
- Product detail pages with image galleries
- Product reviews and ratings display
- Related products recommendations

### AI-Powered Features
- AI-powered search bar with natural language queries
- AI chatbot for customer assistance
- Smart product recommendations based on user input
- Semantic search that understands user intent

### Shopping Experience
- Shopping cart with add/remove/update functionality
- Real-time cart total calculations
- Wishlist/favorites functionality
- Product comparison capabilities

### Checkout Process
- Multi-step checkout flow (shipping, payment, confirmation)
- Secure payment integration with Stripe
- Order summary and review before purchase
- Order success and confirmation pages

### Order Management
- Order history and tracking
- Detailed order information view
- Order status updates and tracking

### Admin Dashboard
- Comprehensive admin panel for store management
- User management interface
- Product management tools
- Order management system
- Review moderation capabilities

### Additional Features
- Real-time notifications and toast messages
- Interactive header with dropdown menus
- Mobile-friendly navigation and hamburger menu
- Social sharing capabilities
- SEO-friendly structure and meta tags

## Tech Stack

- **React**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library
- **Framer Motion**: Animation library
- **React Hot Toast**: Notification system
- **Axios**: HTTP client for API requests
- **Recharts**: Data visualization library

## Components Structure

### Layout Components
- **MainLayout**: Main application layout with header and footer
- **AdminLayout**: Admin-specific layout with sidebar navigation

### Common Components
- **Header**: Navigation header with search and user menu
- **Footer**: Site footer with information links
- **AIChatbot**: Interactive AI assistant widget
- **ProductCard**: Reusable product display component
- **Skeleton**: Loading skeletons for better UX

### Page Components
- **Home**: Landing page with featured products
- **ProductList**: Browse all products with filters
- **ProductDetail**: Individual product information
- **Cart**: Shopping cart management
- **Checkout**: Multi-step checkout process
- **OrderSuccess**: Order confirmation page
- **Profile**: User profile management
- **Admin Dashboard**: Admin panel with various management tools

## API Integration

The frontend communicates with the backend API for:
- User authentication and authorization
- Product catalog management
- Shopping cart operations
- Order processing and management
- AI-powered recommendations
- User profile updates
- Admin operations

## Local Development

### Stripe HTTPS Warning
When running the application locally over `http://localhost`, you will see a warning in the browser console from `Stripe.js`:
`Live Stripe.js integrations must use HTTPS.`

This is a standard warning from Stripe for development environments not using SSL. It does not prevent payment functionality in test mode, but **HTTPS is strictly mandatory for production deployments.**

## Performance Optimizations

- Code splitting and lazy loading for faster initial load
- Efficient state management with React Context
- Memoization techniques to prevent unnecessary re-renders
- Optimized image loading and handling
- Proper error boundaries for graceful error handling