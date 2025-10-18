# YouTube Analytics MVP - Docker Setup

## Quick Start with Docker Compose Watch

1. **Clone and Setup Environment**

   ```bash
   git clone <your-repo>
   cd Vonas
   cp .env.example .env
   # Edit .env with your Google OAuth credentials
   ```

2. **Start All Services with Watch Mode**

   ```bash
   # Start all services (PostgreSQL, App, Prometheus, Grafana)
   docker compose up --build --watch
   ```

3. **Access Services**
   - **Application**: http://localhost:3000
   - **Grafana**: http://localhost:3001 (admin/admin123)
   - **Prometheus**: http://localhost:9090
   - **PostgreSQL**: localhost:5432

## Docker Compose Watch Features

The `--watch` flag enables automatic rebuilding and syncing:

- **File Sync**: Changes in `/src`, `/public`, `/prisma` sync instantly
- **Rebuild Triggers**: Changes in `package.json`, configs trigger rebuild
- **Hot Reload**: Next.js dev server provides instant updates

## Services Overview

### YouTube Analytics MVP App

- **Container**: `youtube-analytics-app`
- **Port**: 3000
- **Features**: Hot reload, file watching, auto-sync

### PostgreSQL Database

- **Container**: `youtube-analytics-postgres`
- **Port**: 5432
- **Credentials**: user/password
- **Health Check**: Built-in readiness check

### Prometheus Monitoring

- **Container**: `youtube-analytics-prometheus`
- **Port**: 9090
- **Config**: `./monitoring/prometheus/prometheus.yml`
- **Targets**: App metrics, Node exporter, PostgreSQL

### Grafana Dashboards

- **Container**: `youtube-analytics-grafana`
- **Port**: 3001
- **Login**: admin/admin123
- **Dashboards**: Pre-configured YouTube Analytics dashboard

### Node Exporter

- **Container**: `youtube-analytics-node-exporter`
- **Port**: 9100
- **Purpose**: System metrics (CPU, memory, disk)

## Development Commands

```bash
# Start all services with watch mode
docker compose up --build --watch

# Start specific service
docker compose up postgres prometheus grafana

# View logs
docker compose logs -f youtube-analytics-mvp
docker compose logs -f postgres

# Stop all services
docker compose down

# Clean up (remove volumes)
docker compose down -v

# Rebuild specific service
docker compose build youtube-analytics-mvp
```

## File Structure

```
Vonas/
├── docker-compose.yaml           # Main compose file
├── .env.example                 # Environment template
├── youtube-analytics-mvp/       # App directory
│   ├── Dockerfile              # Production Dockerfile
│   ├── Dockerfile.dev          # Development Dockerfile
│   └── ...                     # App source code
└── monitoring/                 # Monitoring configuration
    ├── prometheus/
    │   └── prometheus.yml      # Prometheus config
    └── grafana/
        ├── provisioning/       # Auto-provisioning
        └── dashboards/         # Pre-built dashboards
```

## Monitoring & Observability

### Prometheus Metrics

- **App Metrics**: `/api/metrics` endpoint
- **System Metrics**: Node exporter
- **Database Metrics**: PostgreSQL exporter (optional)

### Grafana Dashboards

- **YouTube Analytics MVP**: Main application dashboard
- **System Overview**: CPU, memory, disk usage
- **Database Performance**: Connection pool, queries

### Key Metrics Tracked

- API request count and response times
- YouTube API call frequency and success rates
- Database connection pool status
- System resource utilization
- Error rates and status codes

## Troubleshooting

### Common Issues

1. **Port Conflicts**

   ```bash
   # Check what's using ports
   netstat -tulpn | grep :3000
   # Change ports in docker-compose.yaml if needed
   ```

2. **Database Connection Issues**

   ```bash
   # Check PostgreSQL health
   docker compose exec postgres pg_isready -U user -d youtube_analytics
   ```

3. **File Sync Not Working**

   ```bash
   # Restart with fresh build
   docker compose down
   docker compose up --build --watch
   ```

4. **Grafana Login Issues**
   - Default credentials: admin/admin123
   - Reset: `docker compose exec grafana grafana-cli admin reset-admin-password newpassword`

### Performance Tuning

- **Memory**: Adjust container memory limits in compose file
- **CPU**: Set CPU limits for resource management
- **Storage**: Use volumes for persistent data
- **Network**: Use custom networks for service isolation

## Production Considerations

For production deployment:

1. **Use Production Dockerfile**: Switch to multi-stage build
2. **Environment Variables**: Use secrets management
3. **SSL/TLS**: Add reverse proxy (nginx/traefik)
4. **Scaling**: Use Docker Swarm or Kubernetes
5. **Monitoring**: Add alerting rules and notifications
6. **Backup**: Implement database backup strategy
7. **Security**: Network policies, container scanning
