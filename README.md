# 🚀 FundForge AI

**Forge Ideas. Fund Dreams. Empower Communities.**

FundForge AI is a production-ready Full Stack AI-powered Crowdfunding Platform built with modern technologies and enterprise-level architecture.

## ✨ Features

### 🤖 AI Assistant (Powered by Grok API)
- Campaign title generation
- Story improvement and grammar fixing
- Reward suggestions
- Funding goal analysis
- FAQ generation
- Marketing tips
- Floating chat widget

### 👥 User Roles
- **Supporter** - Explore campaigns, contribute credits, purchase credits
- **Creator** - Create & manage campaigns, approve contributions, withdraw earnings
- **Admin** - Manage users, campaigns, withdrawals, reports, platform analytics

### 💳 Credit-Based Economy
- 10 Credits = $1 (Purchase rate)
- 20 Raised Credits = $1 (Withdrawal rate)
- Multiple credit packages via Stripe
- Automatic refunds on rejection

### 🔐 Security
- Better Auth authentication
- Google OAuth integration
- Role-based access control
- Secure HTTP-only cookies
- Rate limiting & Helmet
- Input validation (Zod)
- MongoDB sanitization

### 📊 Features
- Advanced search & filtering
- Server-side pagination
- MongoDB aggregation pipelines
- Real-time notifications
- Email notifications (SendGrid)
- Image upload (Cloudinary)
- Campaign reporting system
- Analytics dashboards (Recharts)
- Dark/Light theme
- Fully responsive

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query**
- **React Hook Form** + **Zod**
- **Framer Motion**
- **Recharts**
- **Lucide React**

### Backend
- **Express.js**
- **TypeScript**
- **MongoDB** (Mongoose)
- **Better Auth**
- **Stripe**
- **Grok AI API**
- **Cloudinary**
- **SendGrid**
- **Helmet** + **CORS** + **Rate Limiter**

## 📁 Project Structure

```
FundForge-AI/
├── frontend/          # Next.js application
│   └── src/
│       ├── app/       # App Router pages
│       ├── components/# Reusable components
│       ├── providers/ # Context providers
│       ├── lib/       # API client
│       ├── types/     # TypeScript types
│       └── styles/    # Global styles
│
├── backend/           # Express.js API
│   └── src/
│       ├── config/    # Configuration
│       ├── controllers/ # Route handlers
│       ├── services/  # Business logic
│       ├── models/    # MongoDB models
│       ├── routes/    # Express routes
│       ├── middleware/ # Auth, validation
│       ├── validations/ # Zod schemas
│       └── utils/     # Helpers
│
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection
- Stripe account
- Cloudinary account
- Grok API key
- SendGrid account (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd FundForge-AI
```

2. **Backend Setup**
```bash
cd backend
npm install
# Copy .env and fill in your values
cp .env.example .env
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
# Copy .env.local and fill in your values
cp .env.local.example .env.local
npm run dev
```

4. **Open the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

### Environment Variables

#### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
GROK_API_KEY=your_grok_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
SENDGRID_API_KEY=your_sendgrid_key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Scripts

#### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |

#### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Campaigns
- `GET /api/campaigns` - List campaigns (with search, filter, sort, pagination)
- `GET /api/campaigns/featured` - Featured campaigns
- `GET /api/campaigns/categories` - Campaign categories
- `GET /api/campaigns/my` - My campaigns (creator)
- `GET /api/campaigns/:id` - Campaign details
- `POST /api/campaigns` - Create campaign (creator)
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Contributions
- `POST /api/contributions` - Create contribution (supporter)
- `GET /api/contributions/my` - My contributions
- `PUT /api/contributions/:id/approve` - Approve contribution (creator/admin)
- `PUT /api/contributions/:id/reject` - Reject contribution (creator/admin)

### Payments
- `GET /api/payments/packages` - Credit packages
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `GET /api/payments/history` - Payment history
- `POST /api/payments/webhook` - Stripe webhook

### Withdrawals
- `POST /api/withdrawals` - Request withdrawal (creator)
- `GET /api/withdrawals/my` - My withdrawals

### AI
- `POST /api/ai/chat` - AI chat assistant

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/status` - Toggle user status
- `GET /api/admin/campaigns` - All campaigns
- `PUT /api/admin/campaigns/:id/approve` - Approve campaign
- `PUT /api/admin/campaigns/:id/reject` - Reject campaign
- `GET /api/admin/withdrawals` - All withdrawals
- `PUT /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `PUT /api/admin/withdrawals/:id/reject` - Reject withdrawal
- `GET /api/admin/reports` - All reports
- `PUT /api/admin/reports/:id/review|dismiss|resolve|suspend` - Manage reports

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd backend
npm run build
# Deploy to Render or Railway
```

### Database (MongoDB Atlas)
- Use MongoDB Atlas for production
- Set up IP whitelist
- Enable authentication

## 📸 Screenshots

(Screenshots would be added here)

## 🤝 Contributing

Contributions are welcome! Please follow the code standards and ensure all tests pass.

## 📄 License

MIT

## 🙏 Support

- Email: support@fundforge.ai
- GitHub Issues: [Link to issues]
