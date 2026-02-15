# AI Chatbot Setup Guide

## Overview
The Smart Tourist Safety Platform includes an AI-powered chatbot using **Google Gemini API** for intelligent tourist assistance, emergency guidance, and safety information.

## Features
- 🤖 **AI-Powered Responses** - Context-aware conversations using Google Gemini
- 🚨 **Emergency Assistance** - Quick SOS actions and emergency guidance
- 🗺️ **Location-Based Help** - Find nearby police stations, hospitals, and safe zones
- 🌐 **Multi-Language Support** - Assistance in multiple languages
- 💬 **Conversation History** - Maintains context across messages
- ⚡ **Quick Actions** - One-click emergency, police, and safe place queries

## Setup Instructions

### 1. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key

### 2. Configure Environment Variables

Open `backend/.env` and add your Gemini API key:

```env
# AI Chatbot Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:** Replace `your_actual_gemini_api_key_here` with your real API key from Google AI Studio.

### 3. Restart Backend Server

After adding the API key, restart your backend server:

```bash
cd backend
npm run dev
```

## Testing the Chatbot

### 1. Access the Chatbot
- Login to the application
- Look for the floating chat button in the bottom-right corner
- Click to open the chatbot

### 2. Try These Test Messages

**General Help:**
```
Hello, I need help with tourist safety
```

**Emergency:**
```
I need emergency assistance!
```

**Find Police:**
```
Where is the nearest police station?
```

**Safety Tips:**
```
What are some safety tips for tourists in India?
```

**Find Hospitals:**
```
I need to find a hospital nearby
```

### 3. Quick Actions
The chatbot includes three quick action buttons:
- 🚨 **Emergency SOS** - Immediate emergency response
- 📞 **Nearest Police** - Find nearby police stations
- 📍 **Safe Places** - Discover safe zones and public places

## Fallback Mode

If the Gemini API key is not configured or there's an API error, the chatbot automatically switches to **fallback mode** with pre-programmed responses for:
- Emergency situations
- Police station locations
- Hospital information
- Safety tips
- General tourist assistance

This ensures the chatbot always provides helpful information even without AI.

## API Endpoints

### Send Message
```http
POST /api/chatbot/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Where is the nearest police station?",
  "context": {
    "location": "28.6139,77.2090"
  }
}
```

### Quick Action
```http
POST /api/chatbot/quick-action
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "emergency",
  "context": {
    "location": "28.6139,77.2090"
  }
}
```

### Clear History
```http
DELETE /api/chatbot/history
Authorization: Bearer <token>
```

## Customization

### Modify System Prompt
Edit `backend/services/chatbotService.js` to customize the AI's behavior:

```javascript
buildSystemPrompt(context) {
  let prompt = `You are a helpful AI assistant for the Tourist Safety Platform...`;
  // Add your custom instructions here
  return prompt;
}
```

### Add Custom Fallback Responses
Edit the `getFallbackResponse()` method in `chatbotService.js`:

```javascript
getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Add your custom keyword detection
  if (lowerMessage.includes('your_keyword')) {
    return 'Your custom response';
  }
  
  // ... existing code
}
```

## Troubleshooting

### Chatbot Not Responding
1. Check if Gemini API key is set in `.env`
2. Verify backend server is running
3. Check browser console for errors
4. Ensure you're logged in

### API Key Errors
```
Error: API key not valid
```
**Solution:** Verify your Gemini API key is correct and active

### Rate Limiting
```
Error: Too many requests
```
**Solution:** Gemini has rate limits. Wait a few minutes or upgrade your API plan.

### Network Errors
```
Error: Failed to fetch
```
**Solution:** Check your internet connection and backend server status

## Cost & Limits

### Google Gemini Free Tier
- **60 requests per minute**
- **1,500 requests per day**
- **Free forever** for moderate usage

### Paid Plans
For higher usage, check [Google AI Pricing](https://ai.google.dev/pricing)

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on your backend
4. **Validate user input** before sending to AI
5. **Monitor API usage** to prevent abuse

## Additional Features (Optional)

### Voice Input
The chatbot UI includes a microphone button for voice input. To enable:

1. Install speech recognition library:
```bash
npm install react-speech-recognition
```

2. Implement in `AIChatbot.tsx`:
```typescript
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
```

### Multi-Language Support
Gemini supports multiple languages automatically. Just ask in your preferred language!

## Support

For issues or questions:
- Check the [Google AI Documentation](https://ai.google.dev/docs)
- Review backend logs: `backend/logs/`
- Contact support team

---

**Note:** The chatbot works in fallback mode without an API key, but AI-powered responses require a valid Gemini API key.
