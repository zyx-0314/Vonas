# 📊 YouTube Analytics Dashboard MVP

> A modern, scalable YouTube analytics platform built with Next.js, providing real-time insights into channel performance with comprehensive monitoring capabilities.

## 🎯 Project Goals

### Primary Objectives

- **Real-time Analytics**: Provide instant insights into YouTube channel performance
- **User-Friendly Dashboard**: Clean, intuitive interface for content creators
- **Scalable Architecture**: Production-ready setup with monitoring and observability
- **Rapid Development**: 4-hour MVP to core functionality with hot-reload development environment

### Key Features

- 🔐 **Google OAuth Authentication** - Secure YouTube API access
- 📈 **Core Metrics Dashboard** - Views, subscribers, watch time, revenue
- 🎨 **Modern UI/UX** - Tailwind CSS + Shadcn components
- 📊 **Real-time Monitoring** - Prometheus + Grafana integration
- 🐳 **Containerized Development** - Docker with hot-reload support
- 🔄 **State Management** - Zustand for efficient client state
- 🛡️ **Type Safety** - Full TypeScript implementation with Zod validation

## 🛠 Tech Stack

### Core Technologies

- **Framework**: Next.js 14 (Full Stack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Validation**: Zod
- **Authentication**: Passport.js + JWT
- **Testing**: Jest + Supertest
- **Logging**: Winston

### Infrastructure & Monitoring

- **Containerization**: Docker + Docker Compose
- **Monitoring**: Prometheus + Grafana
- **Database**: PostgreSQL 15
- **Development**: Hot-reload with Docker Compose Watch

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (latest version)
- **Node.js 20+** (for local development)
- **Git** for version control
- **Google Cloud Console** account (for YouTube API access)

### Step 1: Clone & Setup Repository

```bash
# Clone the repository
git clone https://github.com/zyx-0314/Vonas.git
cd Vonas

# Create environment file from template
cp .env.example .env
```

### Step 2: Configure Google OAuth

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project or select existing one**

3. **Enable YouTube APIs**:

   - YouTube Data API v3
   - YouTube Analytics API

4. **Create OAuth 2.0 Credentials**:

   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3002/api/auth/google/callback`

5. **Update `.env` file**:

   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_SECRET=your_super_secret_jwt_key_here
   ```

   > Generate NEXTAUTH_SECRET with: `openssl rand -base64 32`

### Step 3: Start the Application

```bash
# Start all services with hot-reload
docker compose up --build --watch
```

This command will:

- ✅ Build the YouTube Analytics MVP application
- ✅ Start PostgreSQL database with health checks
- ✅ Launch Prometheus for metrics collection
- ✅ Start Grafana with pre-configured dashboards
- ✅ Enable Node Exporter for system metrics
- ✅ Set up file watching for instant development updates

### Step 4: Access the Services

Once all containers are running, access the following services:

| Service                   | URL                   | Credentials      |
| ------------------------- | --------------------- | ---------------- |
| **YouTube Analytics MVP** | http://localhost:3002 | Google OAuth     |
| **Grafana Dashboard**     | http://localhost:3001 | admin / admin123 |
| **Prometheus**            | http://localhost:9090 | No auth          |
| **PostgreSQL**            | localhost:5432        | user / password  |

### Step 5: Initialize Database

The database will be automatically initialized when the PostgreSQL container starts. The Prisma schema will create the necessary tables for users and channel metrics.

### Step 6: Test the Application

1. **Open the application**: http://localhost:3002
2. **Click "Login with Google"** to authenticate
3. **Grant YouTube permissions** when prompted
4. **View your dashboard** with real YouTube analytics data

## 🔧 Development Workflow

### Hot Reload Development

The Docker Compose setup includes file watching for instant updates:

```bash
# Start development environment
docker compose up --build --watch

# Make changes to any file in youtube-analytics-mvp/src/
# Changes are automatically synced and hot-reloaded
```

### Available Commands

```bash
# View application logs
docker compose logs -f youtube-analytics-mvp

# View database logs
docker compose logs -f postgres

# Restart specific service
docker compose restart youtube-analytics-mvp

# Stop all services
docker compose down

# Clean restart with fresh volumes
docker compose down -v && docker compose up --build --watch
```

### Database Management

```bash
# Access database directly
docker compose exec postgres psql -U user -d youtube_analytics

# Run Prisma commands inside container
docker compose exec youtube-analytics-mvp npx prisma studio
docker compose exec youtube-analytics-mvp npx prisma db push
```

## 📊 Monitoring & Observability

### Grafana Dashboards

Access Grafana at http://localhost:3001 (admin/admin123) to view:

- **YouTube Analytics MVP Dashboard**: Application-specific metrics
- **API Request Metrics**: Response times, request counts, error rates
- **System Performance**: CPU, memory, disk usage
- **Database Metrics**: Connection pool, query performance

### Prometheus Metrics

The application exposes metrics at `/api/metrics` including:

- `youtube_analytics_requests_total` - Total API requests
- `youtube_analytics_response_time` - API response times
- `youtube_analytics_errors_total` - Error count by type
- `youtube_analytics_active_users` - Current active users

### Key Performance Indicators

Monitor these KPIs in Grafana:

- **Response Time**: < 200ms for optimal user experience
- **Error Rate**: < 1% for reliable service
- **API Success Rate**: > 99% for YouTube API calls
- **Database Connections**: Monitor pool usage

## 🏗 Project Structure

```
Vonas/
├── 📁 youtube-analytics-mvp/     # Main application
│   ├── 📁 src/
│   │   ├── 📁 app/              # Next.js App Router
│   │   ├── 📁 components/       # React components
│   │   ├── 📁 lib/              # Utility functions
│   │   ├── 📁 store/            # Zustand stores
│   │   └── 📁 types/            # TypeScript types
│   ├── 📁 prisma/               # Database schema
│   ├── Dockerfile               # Production container
│   ├── Dockerfile.dev           # Development container
│   └── package.json
├── 📁 monitoring/               # Monitoring configuration
│   ├── 📁 prometheus/           # Prometheus config
│   └── 📁 grafana/              # Grafana dashboards
├── docker-compose.yaml          # Container orchestration
├── .env.example                 # Environment template
└── README.md                    # This file
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
docker compose exec youtube-analytics-mvp npm test

# Run tests in watch mode
docker compose exec youtube-analytics-mvp npm run test:watch

# Run specific test file
docker compose exec youtube-analytics-mvp npm test -- MetricCard.test.tsx
```

### Test Coverage

The project includes:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API route testing with Supertest
- **Type Safety**: Compile-time checks with TypeScript + Zod

## 🚨 Troubleshooting

### Common Issues

**1. Port Conflicts**

```bash
# Check what's using the ports
netstat -tulpn | grep :3002
# Modify ports in docker-compose.yaml if needed
```

**2. Database Connection Issues**

```bash
# Check PostgreSQL health
docker compose exec postgres pg_isready -U user -d youtube_analytics

# View database logs
docker compose logs postgres
```

**3. Google OAuth Errors**

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Ensure redirect URI matches: `http://localhost:3002/api/auth/google/callback`
- Check that YouTube APIs are enabled in Google Cloud Console

**4. File Sync Issues**

```bash
# Restart with fresh build
docker compose down
docker compose up --build --watch
```

**5. Grafana Access Issues**

- Default login: admin/admin123
- Reset password: `docker compose exec grafana grafana-cli admin reset-admin-password newpass`

### Performance Optimization

**Memory Usage**: Adjust container limits in docker-compose.yaml

```yaml
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

**Development Speed**: Use `.dockerignore` to exclude unnecessary files

## 🎯 MVP Milestones (4-Hour Development)

### ✅ Hour 1: Foundation Setup

- [x] Next.js project initialization
- [x] Docker containerization
- [x] PostgreSQL database setup
- [x] Prisma ORM configuration

### ✅ Hour 2: Authentication & API

- [x] Google OAuth implementation
- [x] YouTube API integration
- [x] Database user management
- [x] JWT session handling

### ✅ Hour 3: Dashboard Development

- [x] Shadcn/ui component setup
- [x] Zustand state management
- [x] MetricCard components
- [x] Responsive dashboard layout

### ✅ Hour 4: Monitoring & Polish

- [x] Prometheus metrics integration
- [x] Grafana dashboard configuration
- [x] Error handling and loading states
- [x] Production Docker configuration

## 🎨 Design System

### UI Components

- **MetricCard**: Displays key performance indicators
- **LoginButton**: Google OAuth authentication
- **Dashboard**: Main analytics overview
- **LoadingSpinner**: Async operation feedback

### Color Palette

- **Primary**: YouTube Red (#FF0000)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray shades for backgrounds and text

## 🔮 Future Enhancements

### Phase 2: Advanced Analytics (Next 4-8 hours)

- [ ] Interactive charts with Recharts
- [ ] Video performance deep-dive
- [ ] Revenue tracking and monetization metrics
- [ ] Audience demographics visualization

### Phase 3: User Experience (8-12 hours)

- [ ] Real-time updates with WebSockets
- [ ] Custom dashboard layouts
- [ ] Mobile-responsive design improvements
- [ ] Export functionality (PDF/CSV)

### Phase 4: Scale & Enterprise (12+ hours)

- [ ] Multi-user workspace support
- [ ] Competitor analysis features
- [ ] AI-powered content suggestions
- [ ] Advanced security and compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check this README and `README-Docker.md`
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Development**: Use Docker logs and Grafana for debugging

---

**Happy coding! 🎉**

Transform your YouTube analytics with this modern, scalable dashboard platform.
