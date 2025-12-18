# Deployment Guide for AWS EC2 with Nginx

## Prerequisites
- AWS EC2 instance running Ubuntu/Amazon Linux
- Node.js 18+ installed
- Nginx installed

## Build and Deploy Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Upload to EC2
Upload the `dist/` folder to your EC2 instance:
```bash
scp -r dist/ ubuntu@your-ec2-ip:/var/www/jz-shop/
```

### 4. Nginx Configuration
Create `/etc/nginx/sites-available/jz-shop`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/jz-shop;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /image/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/jz-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build