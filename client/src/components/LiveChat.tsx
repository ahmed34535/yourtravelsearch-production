import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, User, Bot, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
}

interface APIResponse {
  response: string;
  quickResponses: string[];
  timestamp: string;
  agentName?: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveChat({ isOpen, onClose }: LiveChatProps) {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'connecting' | 'connected' | 'typing' | 'idle'>('connecting');
  const [quickResponses, setQuickResponses] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const userContext = {
        name: user?.firstName,
        isAuthenticated,
        recentBookings: [] // Could fetch from API
      };

      const response = await apiRequest('POST', '/api/chat/initialize', { userContext });
      
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        message: response.response,
        sender: 'agent',
        timestamp: new Date(),
        agentName: response.agentName || 'Sarah M.'
      };
      
      setMessages([welcomeMessage]);
      setQuickResponses(response.quickResponses || []);
      setIsConnected(true);
      setAgentStatus('connected');
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      // Fallback welcome message
      const fallbackMessage: ChatMessage = {
        id: Date.now().toString(),
        message: `Hello${isAuthenticated ? ` ${user?.firstName}` : ''}! I'm Sarah from YourTravelSearch support. How can I help you today?`,
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah M.'
      };
      setMessages([fallbackMessage]);
      setIsConnected(true);
      setAgentStatus('connected');
    }
  };

  useEffect(() => {
    if (isOpen && !isConnected) {
      const connectTimer = setTimeout(() => {
        initializeChat();
      }, 1000);

      return () => clearTimeout(connectTimer);
    }
  }, [isOpen, isAuthenticated, user?.firstName]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation history
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: newMessage.trim() }
    ];
    setConversationHistory(newHistory);
    
    setNewMessage('');
    setAgentStatus('typing');

    try {
      const userContext = {
        name: user?.firstName,
        isAuthenticated,
        recentBookings: [] // Could fetch from API
      };

      const response = await apiRequest('POST', '/api/chat/message', {
        message: userMessage.message,
        conversationHistory: newHistory,
        userContext
      });

      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah M.'
      };

      setMessages(prev => [...prev, agentMessage]);
      setQuickResponses(response.quickResponses || []);
      
      // Update conversation history with AI response
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: response.response }
      ]);
      
      setAgentStatus('idle');
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly at support@yourtravelsearch.com.",
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah M.'
      };

      setMessages(prev => [...prev, fallbackMessage]);
      setAgentStatus('idle');
    }
  };

  const quickActions = [
    "I need help with my booking",
    "Flight status inquiry", 
    "Refund request",
    "Change my flight"
  ];

  const handleQuickAction = (action: string) => {
    setNewMessage(action);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white dark:bg-gray-800 border rounded-lg shadow-xl z-50">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <CardTitle className="text-lg">Live Chat Support</CardTitle>
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span>
                  {agentStatus === 'connecting' && 'Connecting...'}
                  {agentStatus === 'connected' && 'Sarah M. - Online'}
                  {agentStatus === 'typing' && 'Sarah M. is typing...'}
                  {agentStatus === 'idle' && 'Sarah M. - Online'}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {!isConnected && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-sm text-gray-600">Connecting to support agent...</p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg p-3`}>
                  {msg.sender === 'agent' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-medium">{msg.agentName}</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.message}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 opacity-60" />
                    <span className="text-xs opacity-60">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {agentStatus === 'typing' && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {isConnected && quickResponses.length > 0 && (
          <div className="px-4 py-2 border-t">
            <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-1">
              {quickResponses.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="flex-1"
            />
            <Button type="submit" disabled={!isConnected || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </div>
  );
}

export function LiveChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg z-40"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
      <LiveChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}