const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'demo-key');

class ChatbotService {
  constructor() {
    // Try gemini-2.0-flash-exp (latest free model)
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.conversationHistory = new Map();
  }

  /**
   * Get AI response for user message
   */
  async getChatResponse(userId, message, context = {}) {
    try {
      // Build context-aware prompt
      const systemPrompt = this.buildSystemPrompt(context);
      const conversationHistory = this.getConversationHistory(userId);
      
      const fullPrompt = `${systemPrompt}

Conversation History:
${conversationHistory}

User: ${message}
Assistant:`;

      // Generate response
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const responseText = response.text();

      // Save to conversation history
      this.addToHistory(userId, 'user', message);
      this.addToHistory(userId, 'assistant', responseText);

      return {
        success: true,
        message: responseText,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Fallback responses
      return {
        success: false,
        message: this.getFallbackResponse(message),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Build system prompt based on context
   */
  buildSystemPrompt(context) {
    const { role, location, userName } = context;

    let prompt = `You are a helpful AI assistant for the Tourist Safety Platform in India. 
Your role is to help tourists stay safe, provide information about safety measures, 
and assist with emergency situations.

Guidelines:
- Be friendly, helpful, and reassuring
- Provide accurate safety information
- In emergencies, prioritize immediate safety actions
- Suggest contacting local authorities when appropriate
- Be culturally sensitive and respectful
- Provide information about Indian tourist destinations, customs, and safety tips
`;

    if (role === 'tourist') {
      prompt += `\nThe user is a tourist. Focus on:
- Safety tips and precautions
- Emergency procedures
- Local customs and etiquette
- Tourist attractions and safe areas
- Health and medical information`;
    } else if (role === 'police') {
      prompt += `\nThe user is a police officer. Focus on:
- Incident response procedures
- Tourist assistance protocols
- Safety coordination
- Emergency management`;
    } else if (role === 'admin') {
      prompt += `\nThe user is an administrator. Focus on:
- System operations
- User management
- Analytics and reporting
- Platform features`;
    }

    if (location) {
      prompt += `\n\nUser's current location: ${location}`;
    }

    if (userName) {
      prompt += `\n\nUser's name: ${userName}`;
    }

    return prompt;
  }

  /**
   * Get conversation history for user
   */
  getConversationHistory(userId) {
    const history = this.conversationHistory.get(userId) || [];
    return history
      .slice(-10) // Last 10 messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
  }

  /**
   * Add message to conversation history
   */
  addToHistory(userId, role, content) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }

    const history = this.conversationHistory.get(userId);
    history.push({
      role,
      content,
      timestamp: new Date(),
    });

    // Keep only last 20 messages
    if (history.length > 20) {
      history.shift();
    }
  }

  /**
   * Clear conversation history for user
   */
  clearHistory(userId) {
    this.conversationHistory.delete(userId);
  }

  /**
   * Get fallback response when AI is unavailable
   */
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Emergency keywords
    if (
      lowerMessage.includes('emergency') ||
      lowerMessage.includes('help') ||
      lowerMessage.includes('sos') ||
      lowerMessage.includes('danger')
    ) {
      return `I understand this is an emergency. Please:
1. Call emergency services immediately: 112 (India Emergency Number)
2. Use the SOS button in the app to alert nearby authorities
3. Share your location with trusted contacts
4. Stay in a safe, public place if possible

Your safety is the top priority. Help is on the way.`;
    }

    // Police/authorities
    if (lowerMessage.includes('police') || lowerMessage.includes('station')) {
      return `To find the nearest police station:
1. Use the map feature in the app
2. Call 100 for police assistance
3. Your location is being tracked for your safety

Would you like me to alert nearby authorities?`;
    }

    // Hospital/medical
    if (
      lowerMessage.includes('hospital') ||
      lowerMessage.includes('doctor') ||
      lowerMessage.includes('medical')
    ) {
      return `For medical assistance:
1. Call 108 for ambulance services
2. Use the app to find nearby hospitals
3. Contact your embassy if you're an international tourist

Do you need immediate medical attention?`;
    }

    // Safety tips
    if (lowerMessage.includes('safe') || lowerMessage.includes('tip')) {
      return `Here are some safety tips for tourists in India:
1. Keep your valuables secure
2. Stay in well-lit, populated areas
3. Use registered taxis or ride-sharing apps
4. Keep emergency contacts handy
5. Inform someone about your travel plans
6. Carry a copy of your ID and passport
7. Be aware of your surroundings

Would you like specific safety information for your location?`;
    }

    // Default response
    return `I'm here to help with your safety and travel needs. I can assist with:
- Emergency situations and SOS alerts
- Finding nearby police stations and hospitals
- Safety tips and precautions
- Information about safe areas
- Travel guidance

How can I help you today?`;
  }

  /**
   * Handle quick actions
   */
  async handleQuickAction(userId, action, context = {}) {
    const actions = {
      emergency: `🚨 EMERGENCY ALERT ACTIVATED

Immediate actions:
1. Calling emergency services (112)
2. Alerting nearby police and authorities
3. Notifying your emergency contacts
4. Sharing your real-time location

Stay calm. Help is on the way. 

What is your emergency?`,

      police: `🚔 Finding nearest police stations...

Based on your location, here are the nearest police stations:
1. [Station Name] - 0.5 km away
2. [Station Name] - 1.2 km away
3. [Station Name] - 2.0 km away

Emergency Police Number: 100
Tourist Police Helpline: 1363

Would you like directions to any of these stations?`,

      'safe-places': `🏛️ Safe places near you:

Public Places:
- Shopping malls and markets
- Hotels and restaurants
- Tourist information centers
- Government buildings

24/7 Safe Zones:
- Railway stations
- Airports
- Major hotels
- Police stations

Would you like specific recommendations for your area?`,
    };

    return {
      success: true,
      message: actions[action] || 'Action not recognized.',
      timestamp: new Date(),
    };
  }
}

// Export singleton instance
module.exports = new ChatbotService();
