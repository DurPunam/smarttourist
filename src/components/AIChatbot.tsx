import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff, Phone, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContextImproved';
import api from '@/utils/apiClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: string;
  variant: 'default' | 'destructive' | 'outline';
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI safety assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const quickActions: QuickAction[] = [
    {
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Emergency SOS',
      action: 'emergency',
      variant: 'destructive',
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: 'Nearest Police',
      action: 'police',
      variant: 'outline',
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: 'Safe Places',
      action: 'safe-places',
      variant: 'outline',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call chatbot API
      const response = await api.post('/chatbot/message', {
        message: text,
        context: {
          userId: user?.id,
          role: user?.role,
          location: null, // Add user location if available
        },
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message || response.data.response || 'I received your message.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      // Enhanced fallback responses
      let fallbackResponse = '';
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('emergency') || lowerText.includes('help') || lowerText.includes('sos')) {
        fallbackResponse = '🚨 **EMERGENCY DETECTED**\n\nImmediate Actions:\n• Call 112 (Emergency Services)\n• Call 1363 (Tourist Police)\n• Your location is being shared with authorities\n• Stay calm and stay in a safe place\n\nI\'m here to help. What specific assistance do you need?';
      } else if (lowerText.includes('police') || lowerText.includes('station')) {
        fallbackResponse = '👮 **Nearest Police Stations:**\n\n1. **Connaught Place Police Station**\n   📍 Connaught Place, New Delhi\n   📞 011-2336-1100\n   🚗 2.5 km away\n\n2. **Parliament Street Police Station**\n   📍 Parliament Street, New Delhi\n   📞 011-2336-2222\n   🚗 3.1 km away\n\n**Tourist Police Helpline:** 1363 (24/7)';
      } else if (lowerText.includes('hospital') || lowerText.includes('medical') || lowerText.includes('doctor')) {
        fallbackResponse = '🏥 **Nearest Hospitals:**\n\n1. **AIIMS (All India Institute of Medical Sciences)**\n   📍 Ansari Nagar, New Delhi\n   📞 011-2658-8500\n   🚗 4.2 km away\n   ⭐ 24/7 Emergency\n\n2. **Ram Manohar Lohia Hospital**\n   📍 Baba Kharak Singh Marg\n   📞 011-2336-5525\n   🚗 2.8 km away\n\n**Emergency Ambulance:** 102';
      } else if (lowerText.includes('safe') || lowerText.includes('danger') || lowerText.includes('risk')) {
        fallbackResponse = '🛡️ **Safety Information:**\n\n**Safe Areas Nearby:**\n• India Gate (Well-lit, high security)\n• Connaught Place (Tourist-friendly)\n• Major hotels and shopping malls\n\n**Safety Tips:**\n✓ Stay in well-lit areas\n✓ Keep emergency contacts handy\n✓ Share your location with family\n✓ Avoid isolated areas at night\n\n**24/7 Helplines:**\n• Tourist Police: 1363\n• Women Helpline: 1091\n• Emergency: 112';
      } else if (lowerText.includes('location') || lowerText.includes('where') || lowerText.includes('lost')) {
        fallbackResponse = '📍 **Location Assistance:**\n\nYour current location is being tracked for safety.\n\n**If you\'re lost:**\n1. Stay calm and stay where you are\n2. Call Tourist Police: 1363\n3. Share your location via the app\n4. Look for nearby landmarks\n5. Ask locals for directions to main areas\n\n**Major Landmarks:**\n• India Gate\n• Connaught Place\n• Red Fort\n• Qutub Minar\n\nWould you like directions to any of these?';
      } else if (lowerText.includes('food') || lowerText.includes('restaurant') || lowerText.includes('eat')) {
        fallbackResponse = '🍽️ **Safe Dining Options:**\n\n**Recommended Restaurants:**\n• Connaught Place - Multiple cuisines\n• Khan Market - Upscale dining\n• Karim\'s (Jama Masjid) - Authentic Mughlai\n\n**Safety Tips:**\n✓ Choose busy, well-reviewed places\n✓ Drink bottled water only\n✓ Avoid street food if sensitive stomach\n✓ Check hygiene ratings\n\nNeed specific cuisine recommendations?';
      } else if (lowerText.includes('transport') || lowerText.includes('taxi') || lowerText.includes('metro')) {
        fallbackResponse = '🚇 **Safe Transportation:**\n\n**Recommended Options:**\n1. **Delhi Metro** (Safest)\n   • Clean, secure, affordable\n   • Tourist cards available\n\n2. **Prepaid Taxis**\n   • Airport/Railway prepaid counters\n   • Ola/Uber apps\n\n3. **Auto-rickshaws**\n   • Use meter or negotiate fare\n   • Avoid late night travel\n\n**Safety Tips:**\n✓ Share ride details with family\n✓ Sit in back seat\n✓ Keep valuables secure\n✓ Use GPS tracking';
      } else if (lowerText.includes('weather') || lowerText.includes('temperature')) {
        fallbackResponse = '🌤️ **Weather Information:**\n\nCurrent conditions in Delhi:\n• Temperature: 25°C\n• Conditions: Partly cloudy\n• Air Quality: Moderate\n\n**Travel Tips:**\n✓ Carry water bottle\n✓ Use sunscreen\n✓ Wear comfortable shoes\n✓ Check air quality for outdoor activities\n\nStay hydrated and safe!';
      } else {
        fallbackResponse = `I understand you\'re asking about "${text}".\n\n**I can help you with:**\n• Emergency assistance (SOS)\n• Finding police stations\n• Locating hospitals\n• Safety information\n• Transportation guidance\n• Restaurant recommendations\n• Weather updates\n\n**Quick Actions:**\n• Type "emergency" for immediate help\n• Type "police" for nearest stations\n• Type "hospital" for medical facilities\n• Type "safe" for safety tips\n\nHow can I assist you today?`;
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      emergency: 'I need emergency assistance! Please help!',
      police: 'Where is the nearest police station?',
      'safe-places': 'What are the safest places nearby?',
    };

    handleSendMessage(actionMessages[action]);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice recognition here
    // Using Web Speech API or react-speech-recognition
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full bg-primary-500 hover:bg-primary-600 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px]"
          >
            <GlassCard className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/20">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-secondary-500 animate-pulse" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    AI Safety Assistant
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 p-4 border-b border-white/20 dark:border-gray-700/20">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant={action.variant}
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="flex-1 gap-1"
                  >
                    {action.icon}
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/20 dark:bg-gray-800/20 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/20 dark:bg-gray-800/20 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce delay-100" />
                          <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-white/20 dark:border-gray-700/20">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleVoiceInput}
                    className={isListening ? 'bg-red-500 text-white' : ''}
                  >
                    {isListening ? (
                      <MicOff className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="bg-primary-500 hover:bg-primary-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
