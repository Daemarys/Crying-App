# Days Without Crying App 🥲

Just an app to track Workplace Emotional Safety 💙
## Setup Instructions

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to: `http://localhost:3000`

### Admin Features

- **View Statistics**: `http://localhost:3000/api/admin/stats`
- **Download CSV**: `http://localhost:3000/api/admin/download-csv`

### Deployment Options

#### Option 1: Deploy to Vercel (Recommended - Free)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Your app will be live at: `https://your-app.vercel.app`

#### Option 2: Deploy to Render (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set build command: `npm install`
6. Set start command: `npm start`

#### Option 3: Deploy to Railway (Free)

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Railway will auto-detect and deploy

### Security Note

The admin endpoints (`/api/admin/*`) should be protected in production. Consider adding:
- API key authentication
- Password protection
- IP whitelist

### Data Storage

All crying reasons are stored in `crying_data.json` on the server. Only you (the server owner) can access this file and the admin endpoints.

Users who access the shared app URL can use the app but cannot see others' data or export anything.
