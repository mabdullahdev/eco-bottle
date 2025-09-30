# EcoBottle - High-Traffic E-commerce Landing Page

A comprehensive, scalable e-commerce landing page for eco-friendly water bottles built with Next.js, Node.js, and optimized for high-traffic scenarios.

## 🚀 Features

### Frontend (Next.js)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Hero Section**: Parallax scrolling and dynamic animations
- **A/B Testing**: Headline variants toggleable via query parameters
- **Real-time Form Validation**: Contact form with Zod schema validation
- **Custom Animations**: Framer Motion for smooth transitions
- **Real Data Fetching**: Product listings from backend API
- **Server-Side Rendering (SSR)**: Optimized initial page loads

### Backend (Node.js)
- **JWT Authentication**: Secure user authentication system
- **CRUD API**: Complete product management endpoints
- **Rate Limiting**: Protection against abuse and DDoS
- **Database Integration**: MongoDB with Mongoose ODM
- **Redis Caching**: High-performance caching layer
- **Error Handling**: Comprehensive error management
- **Input Validation**: Express-validator for data sanitization

### High-Traffic Optimization
- **Docker Containerization**: Multi-service architecture
- **Load Balancing**: Nginx reverse proxy with multiple backend instances
- **Auto-scaling**: Docker Compose with multiple backend replicas
- **Caching Strategy**: Redis for API response caching
- **CDN Simulation**: Optimized image handling and static assets
- **Monitoring**: Prometheus and Grafana for system metrics
- **Performance Testing**: Artillery and custom load testing scripts

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eco-bottle
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Install stress testing dependencies
cd stress-test && npm install && cd ..
```

### 3. Environment Configuration

Create environment files:

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

**Frontend (.env.local)**
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

### 4. Database Setup

**Option A: Using Docker (Recommended)**
```bash
# Start MongoDB and Redis with Docker
docker-compose up mongodb redis -d
```

**Option B: Local Installation**
- Install MongoDB locally
- Install Redis locally
- Update connection strings in backend/.env

### 5. Seed Database
```bash
cd backend
npm run seed
```

## 🚀 Running the Application

### Development Mode

**Start all services:**
```bash
npm run dev
```

**Or start individually:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Production Mode with Docker

**Start all services:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop services:**
```bash
docker-compose down
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Load Balancer**: http://localhost:80
- **Monitoring Dashboard**: http://localhost:3001 (Grafana)
- **Metrics**: http://localhost:9090 (Prometheus)

## 🧪 Testing & Performance

### Load Testing

**Run stress test with 1000 concurrent users:**
```bash
cd stress-test
npm run test:1000
```

**Run Artillery load test:**
```bash
cd stress-test
npm run test:artillery
```

**Custom concurrency:**
```bash
cd stress-test
node load-test.js 5000 http://localhost:5000
```

### A/B Testing

Test different headline variants:
- Variant A: http://localhost:3000?variant=A
- Variant B: http://localhost:3000?variant=B

## 📊 Performance Metrics

The application is designed to handle:
- **1000+ concurrent users**
- **<200ms average response time**
- **99%+ uptime**
- **Auto-scaling under load**

### Performance Criteria
- ✅ Average Response Time: <200ms
- ✅ 95th Percentile: <500ms  
- ✅ Success Rate: >99%
- ✅ Zero errors under normal load

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Load Balancer │    │   Backend       │
│   (Next.js)     │◄──►│   (Nginx)       │◄──►│   (Node.js)     │
│   Port: 3000    │    │   Port: 80      │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Monitoring    │    │   Database      │
                       │   (Grafana)     │    │   (MongoDB)     │
                       │   Port: 3001    │    │   Port: 27017   │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Metrics       │    │   Cache         │
                       │   (Prometheus)  │    │   (Redis)       │
                       │   Port: 9090    │    │   Port: 6379    │
                       └─────────────────┘    └─────────────────┘
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Health
- `GET /health` - Health check endpoint

## 🚀 Deployment

### Local Deployment
```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Production Deployment

**Frontend (Vercel/Netlify):**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `frontend/.next`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

**Backend (Heroku/DigitalOcean):**
1. Create new app
2. Connect GitHub repository
3. Set environment variables
4. Enable auto-deploy

**Database (MongoDB Atlas):**
1. Create cluster
2. Get connection string
3. Update `MONGODB_URI` in environment

**Cache (Redis Cloud):**
1. Create Redis instance
2. Get connection details
3. Update Redis config in environment

## 📈 Scaling for 100k+ Users

### Infrastructure Recommendations

1. **Load Balancing**
   - Use AWS Application Load Balancer or Google Cloud Load Balancer
   - Implement health checks and auto-scaling groups

2. **Database Scaling**
   - MongoDB Atlas with sharding
   - Read replicas for read-heavy operations
   - Connection pooling

3. **Caching Strategy**
   - Redis Cluster for distributed caching
   - CDN for static assets (CloudFront, CloudFlare)
   - Application-level caching

4. **Monitoring & Alerting**
   - Prometheus + Grafana for metrics
   - ELK Stack for logging
   - PagerDuty for alerting

5. **Auto-scaling**
   - Kubernetes with Horizontal Pod Autoscaler
   - AWS ECS/EKS or Google GKE
   - Container orchestration

### Performance Optimizations

1. **Database**
   - Index optimization
   - Query optimization
   - Connection pooling
   - Read replicas

2. **Caching**
   - Redis clustering
   - CDN implementation
   - Browser caching
   - API response caching

3. **Application**
   - Code splitting
   - Lazy loading
   - Image optimization
   - Bundle optimization

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
```bash
# Check MongoDB connection
docker-compose logs mongodb

# Check Redis connection  
docker-compose logs redis

# Restart services
docker-compose restart backend
```

**Frontend build errors:**
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run build
```

**Database connection issues:**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Reset database
docker-compose down
docker volume rm eco-bottle_mongodb_data
docker-compose up -d
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Email: support@ecobottle.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**Built with ❤️ for a sustainable future**
