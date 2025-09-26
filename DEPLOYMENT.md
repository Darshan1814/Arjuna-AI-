# Deployment Guide for Render

## Environment Variables Required

When deploying to Render, set these environment variables in your Render dashboard:

### Core Features Environment Variables

```env
# VAPI Configuration for AVR Audio Virtual Assistant
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_actual_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_actual_vapi_assistant_id
VAPI_PRIVATE_KEY=your_actual_vapi_private_key

# Gemini AI for Chat Functionality
GEMINI_API_KEY=your_actual_gemini_api_key

# Node Environment
NODE_ENV=production
```

### Optional Environment Variables (if using database features)

```env
# MongoDB Connection (if needed for user data)
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration (if authentication is needed)
NEXTAUTH_URL=https://your-render-app-url.onrender.com
NEXTAUTH_SECRET=your_nextauth_secret
```

## Render Deployment Steps

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the `Arjuna-AI-` repository

2. **Configure Build Settings**
   - **Name**: `arjuna-ai` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   - In the Render dashboard, go to Environment tab
   - Add all the environment variables listed above
   - Replace placeholder values with your actual API keys

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

## Core Features Available

The deployed application will include these sidebar features:

- **Dashboard** - Main overview and navigation hub
- **Consult Yantra** - AVR Audio Virtual Assistant for DBT guidance  
- **Game with Yantra** - Interactive DBT learning with AI companion
- **LearnQuest** - Educational games and rewards system
- **DBT Setup** - Step-by-step Aadhaar seeding and account setup tracker

## Important Notes

- The `.env.local` file is not included in the repository for security
- You must set the actual API keys in Render's environment variables
- The application uses VAPI for voice features and Gemini AI for chat
- All sensitive data has been removed from the repository

## Testing Deployment

After deployment, test these core features:
1. Dashboard loads correctly
2. Consultation page with AVR voice assistant works
3. DBT Setup tracker functions properly
4. LearnQuest and Game with Yantra are accessible

## Support

If you encounter issues during deployment, check:
1. All environment variables are set correctly
2. API keys are valid and have proper permissions
3. Build logs in Render dashboard for any errors