# Saurav Kumar - Portfolio Website

A complete **production-ready portfolio website** with an **Admin Panel** for content management. Built with modern technologies and featuring a futuristic design with smooth animations.

## 🚀 Features

### Frontend
- **One-page vertical scroll** portfolio with full viewport height sections
- **Futuristic design** with black background, white text, and grayscale highlights
- **GSAP animations** with ScrollTrigger for smooth reveals
- **Three.js** particle system and 3D backgrounds
- **Lenis smooth scrolling** for enhanced user experience
- **Responsive design** optimized for all devices
- **SEO optimized** with meta tags and structured data
- **Accessibility features** with ARIA labels and keyboard navigation

### Backend
- **Express.js** REST API with comprehensive endpoints
- **Prisma ORM** with MySQL database
- **JWT authentication** for admin panel security
- **File uploads** with Multer (images and PDFs)
- **Email integration** with Nodemailer (Gmail SMTP)
- **Input validation** and error handling
- **Rate limiting** and security middleware

### Admin Panel
- **Secure login** with JWT authentication
- **Profile management** with file uploads
- **Skills CRUD** with SVG icon support
- **Projects CRUD** with image uploads
- **Certificates CRUD** with verification links
- **Real-time updates** reflected on the portfolio

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **GSAP** for animations
- **Three.js** with React Three Fiber
- **Lenis** for smooth scrolling
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **Prisma** ORM with MySQL
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email services
- **Bcryptjs** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
my-Portfolio/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── skills.js
│   │   ├── projects.js
│   │   ├── certificates.js
│   │   ├── contact.js
│   │   └── upload.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ProfileManager.jsx
│   │   │   │   ├── SkillsManager.jsx
│   │   │   │   ├── ProjectsManager.jsx
│   │   │   │   └── CertificatesManager.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Certificates.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Preloader.jsx
│   │   │   ├── ScrollProgress.jsx
│   │   │   └── ThreeBackground.jsx
│   │   ├── hooks/
│   │   │   ├── useLenis.js
│   │   │   └── useScrollTrigger.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL** database
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-Portfolio
```

### 2. Install Dependencies
```bash
npm run setup
```

This will install dependencies for both frontend and backend.

### 3. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE portfolio_db;
```

#### Configure Environment Variables
Copy the example environment file and update with your values:

```bash
cd backend
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

# Email Configuration (Gmail SMTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Server
PORT=5000
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"
```

#### Initialize Database
```bash
cd backend
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Start Development Servers

#### Option 1: Start Both Servers (Recommended)
```bash
npm run dev
```

#### Option 2: Start Servers Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Access the Application
- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:5000/api

## 📱 Portfolio Sections

### 1. Hero Section
- Name, tagline, and profile photo
- Social media links
- Download CV button
- Three.js particle background
- GSAP text animations

### 2. About Section
- Professional summary
- Contact information
- Skills overview
- Statistics and achievements
- Code snippet visualization

### 3. Skills Section
- Categorized skills with SVG icons
- Hover effects and animations
- Admin-manageable content
- Responsive grid layout

### 4. Projects Section
- Featured and regular projects
- Project cards with images
- Live demo and GitHub links
- Tech stack tags
- GSAP hover effects

### 5. Certificates Section
- Professional certifications
- Verification links
- Issue dates and credentials
- Flip animations on scroll

### 6. Contact Section
- Contact form with validation
- Email integration
- Social links
- Response time information

## 🎛 Admin Panel Features

### Profile Management
- Update personal information
- Upload profile photo
- Upload CV/Resume
- Manage social media links

### Skills Management
- Add/Edit/Delete skills
- Upload SVG icons
- Categorize skills
- Set display order

### Projects Management
- Create project portfolios
- Upload project images
- Add live and GitHub links
- Mark as featured
- Manage tech stack

### Certificates Management
- Add professional certificates
- Upload certificate images
- Add verification URLs
- Set issue dates and credentials

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in your `.env` file

### Database Configuration
- Supports MySQL, PostgreSQL, and SQLite
- Update `DATABASE_URL` in `.env` accordingly
- Run `npx prisma db push` after schema changes

### File Upload Configuration
- Default max file size: 5MB
- Supported formats: Images (JPG, PNG, GIF) and PDFs
- Upload directory: `backend/uploads/`

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend Deployment (Railway/Heroku)
```bash
cd backend
# Set environment variables in your hosting platform
# Deploy the backend folder
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Update `DATABASE_URL` with production database
- Configure email settings for production
- Set secure `JWT_SECRET`

## 🎨 Customization

### Styling
- Edit `frontend/src/styles/main.css` for global styles
- Modify `frontend/tailwind.config.js` for theme customization
- Update color scheme in CSS variables

### Animations
- GSAP animations in component `useEffect` hooks
- Three.js scenes in `ThreeBackground.jsx`
- Customize scroll triggers and timing

### Content
- All content is manageable through the admin panel
- Default content is seeded in `backend/prisma/seed.js`
- Update seed data for initial content

## 🔒 Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- File type validation for uploads
- CORS configuration
- Helmet.js security headers

## 📊 Performance Optimizations

- Lazy loading for images
- Code splitting with Vite
- GSAP ScrollTrigger for efficient animations
- Optimized bundle sizes
- Image compression for uploads

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check MySQL service
sudo systemctl status mysql

# Verify database credentials
mysql -u username -p -h localhost
```

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
```

#### File Upload Issues
- Check file size limits
- Verify upload directory permissions
- Ensure proper file types

#### Email Not Sending
- Verify Gmail app password
- Check SMTP settings
- Test with a simple email first

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### User Management
- `GET /api/userinfo` - Get user information (public)
- `PUT /api/userinfo` - Update user information (admin)

### Skills
- `GET /api/skills` - Get all skills (public)
- `POST /api/skills` - Create skill (admin)
- `PUT /api/skills/:id` - Update skill (admin)
- `DELETE /api/skills/:id` - Delete skill (admin)

### Projects
- `GET /api/projects` - Get all projects (public)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Certificates
- `GET /api/certificates` - Get all certificates (public)
- `POST /api/certificates` - Create certificate (admin)
- `PUT /api/certificates/:id` - Update certificate (admin)
- `DELETE /api/certificates/:id` - Delete certificate (admin)

### File Uploads
- `POST /api/upload/photo` - Upload profile photo (admin)
- `POST /api/upload/cv` - Upload CV (admin)
- `POST /api/upload/project-image` - Upload project image (admin)
- `POST /api/upload/certificate-image` - Upload certificate image (admin)

### Contact
- `POST /api/contact` - Send contact form email

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Saurav Kumar**
- Portfolio: [sauravkumar.dev](https://sauravkumar.dev)
- GitHub: [@sauravkumar](https://github.com/sauravkumar)
- LinkedIn: [Saurav Kumar](https://linkedin.com/in/sauravkumar)

## 🙏 Acknowledgments

- [GSAP](https://greensock.com/) for amazing animations
- [Three.js](https://threejs.org/) for 3D graphics
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS
- [Prisma](https://prisma.io/) for database ORM
- [React](https://reactjs.org/) for the frontend framework

---

**Built with ❤️ by Saurav Kumar**
