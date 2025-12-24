# IdeaShare - Project Setup Complete! 🎉

## ✅ Currently Running

### Backend (API Server)
- **URL**: http://localhost:9000
- **Status**: ✅ Running
- **Health Check**: http://localhost:9000/

### Frontend (React App)
- **URL**: http://localhost:3000
- **Status**: Should be running

## 🔧 How to Test Login/Signup

### Option 1: Use the Frontend (Recommended)
1. Open your browser: **http://localhost:3000**
2. Click **"Sign Up"** button in navbar
3. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
4. Click **"Sign Up"**
5. You'll be redirected to Dashboard automatically!

### Option 2: Test with curl (Backend only)

```bash
# Register a new user
curl -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login with the user
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📝 Available Features

1. **Landing Page** - `/` - Welcome page with features
2. **Sign Up** - `/signup` - Create new account
3. **Login** - `/login` - Login to existing account
4. **Dashboard** - `/dashboard` - View all ideas (requires login)
5. **Add Idea** - `/add-idea` - Share new idea (requires login)

## ⚠️ Important Notes

- **Data is temporary**: Since MongoDB is not connected, all data is stored in memory
- **Data will be lost**: When you restart the backend, all users and ideas will be deleted
- **For persistent data**: Connect MongoDB by adding `MONGODB_URI` to `.env` file

## 🐛 Troubleshooting

### "Login failed" error?
1. Make sure backend is running on port 9000
2. Check browser console (F12) for detailed errors
3. Try signing up first if you haven't created an account

### Backend not responding?
```bash
# Check if backend is running
lsof -i :9000

# If not, restart it
cd /home/baby/Desktop/project-full12/backend
PORT=9000 node server.js
```

### Frontend not loading?
```bash
# Restart frontend
cd /home/baby/Desktop/project-full12/frontend
npm start
```

## 🚀 Next Steps

1. **Add MongoDB** for data persistence
2. **Add more features** like edit/delete ideas
3. **Add comments** functionality
4. **Add likes** functionality
5. **Add user profiles**

---

**Backend API Documentation**: http://localhost:9000
**Frontend App**: http://localhost:3000

Enjoy building! 🎨✨
