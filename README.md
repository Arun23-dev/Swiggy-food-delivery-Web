# 🍽️ Swiggy Clone Project

A full-stack web application that replicates the core functionality of Swiggy, India's leading food delivery platform. This project features a modern React frontend with a Node.js backend proxy server.

## 🚀 Features

### Frontend Features
- **Home Page**: Complete landing page with food delivery, grocery shopping, and dine-out options
- **Restaurant Listing**: Browse restaurants with filtering and search capabilities
- **Restaurant Menu**: Detailed menu pages with food items, prices, and descriptions
- **Search Functionality**: Search restaurants and menu items
- **Live Data Fetching**: Real-time data fetching from external APIs with dynamic updates
- **Infinite Scroll**: Seamless pagination with infinite scroll for restaurant listings
- **Loading States**: Shimmer loading animations for better user experience
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Modern UI**: Beautiful and intuitive user interface

### Backend Features
- **Proxy Server**: Handles API requests to external food delivery services
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Secure environment variable management
- **Error Handling**: Robust error handling and logging

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Axios** - HTTP client for API requests
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Swiggy-Project/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── City/        # City delivery components
│   │   │   ├── Dineout/     # Dine-out related components
│   │   │   ├── Food/        # Food delivery components
│   │   │   ├── Footer/      # Footer components
│   │   │   ├── Header/      # Header components
│   │   │   ├── ResturantFoodMenu/  # Restaurant menu components
│   │   │   ├── Resturants/  # Restaurant listing components
│   │   │   ├── Shimmer/     # Loading skeleton components
│   │   │   └── ShopItems/   # Shopping components
│   │   ├── pages/           # Main page components
│   │   ├── Utils/           # Utility functions and data
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── Backend/                 # Node.js backend server
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
└── package.json            # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arun23-dev/Swiggy_Clone.git
   cd Swiggy-Project
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../Backend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the Backend directory:
   ```env
   PORT=5000
   ORIGIN_URL=http://localhost:8000
   FOOD_DELIVERY=your_food_delivery_api_url
   FOOD_MENU_PREFIX=your_menu_api_prefix
   FOOD_MENU_SUFFIX=your_menu_api_suffix
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:8000`

3. **Build for Production**
   ```bash
   cd Frontend
   npm run build
   ```

## 📱 Available Routes

- `/` - Home page with food delivery options
- `/resturants` - Restaurant listing page
- `/city/delhi/:restaurantId` - Individual restaurant menu page
- `/city/delhi/:restaurantId/search` - Search functionality within restaurant

## 🔧 API Endpoints

### Backend API Routes
- `GET /resturants?offset=<number>` - Fetch restaurant data
- `GET /city/delhi/:id` - Fetch restaurant menu by ID

## 🎨 Key Components

### Frontend Components
- **Header**: Navigation and search functionality
- **FoodOption**: Food delivery service options
- **ShopOption**: Grocery shopping options
- **DineOption**: Dine-out restaurant options
- **ResturantDataFetch**: Restaurant data fetching and display
- **ResturantFoodMenu**: Restaurant menu display
- **Shimmer**: Loading skeleton components

### Backend Services
- **Proxy Server**: Handles external API requests
- **CORS Middleware**: Enables cross-origin requests
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Arun Chaudhary**
- GitHub: [@Arun23-dev](https://github.com/Arun23-dev)
- Project: [Swiggy Clone](https://github.com/Arun23-dev/Swiggy_Clone)

## 🙏 Acknowledgments

- Inspired by Swiggy's user interface and functionality
- Built with modern web technologies for optimal performance
- Designed with user experience in mind

---

⭐ If you find this project helpful, please give it a star!
