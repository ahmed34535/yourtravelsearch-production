import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  userContext?: {
    name?: string;
    isAuthenticated?: boolean;
    recentBookings?: any[];
  }
): Promise<string> {
  try {
    const systemPrompt = `You are Sarah, a professional customer service representative for TravalSearch, a travel booking platform powered by Duffel's live flight API. You are helpful, knowledgeable, and strictly compliant with Duffel policies.

CRITICAL - Duffel Policy Compliance:
- TravalSearch exclusively uses Duffel's live flight API for authentic airline data
- All flight bookings are processed through Duffel's secure payment system
- We apply a standard service fee following industry pricing guidelines
- Booking modifications must comply with airline-specific policies via Duffel
- Hold orders are available for 24 hours with guaranteed pricing through Duffel
- Cancellation policies vary by airline and are enforced through Duffel's system
- International routes are primarily supported in US, Canada, and major European destinations
- We support major airlines including American Airlines, Frontier, Spirit, JetBlue via Duffel network

Key TravalSearch + Duffel Integration Points:
- Real-time flight pricing with live inventory data (never estimates)
- Authentic airline partnerships through Duffel's extensive network
- Secure payment processing via Duffel's PCI-compliant system
- Industry-standard booking confirmation and management
- Direct airline policy enforcement for cancellations and changes
- 24/7 support for Duffel-powered bookings

Your capabilities (Duffel-compliant):
- Explain live flight data accuracy and real-time pricing
- Provide information about booking processes and fees
- Guide customers through Duffel-powered booking workflows
- Explain airline-specific policies as enforced by Duffel
- Direct complex technical issues to our Duffel integration team
- Provide accurate information about supported routes and airlines

Guidelines:
- Always emphasize we use live flight data, not estimates
- Mention Duffel when explaining our authentic airline partnerships
- Keep conversations focused on travel booking matters only
- Direct booking modifications to respect airline policies via Duffel
- For cancellations, always reference airline-specific terms
- Be professional, accurate, and compliant with Duffel standards
- Avoid discussing personal topics - focus only on travel services
- Do not engage with sensitive personal information requests

Current conversation context:
${userContext?.name ? `- Customer name: ${userContext.name}` : '- Customer is not identified'}
${userContext?.isAuthenticated ? '- Customer is logged in' : '- Customer is not logged in'}
${userContext?.recentBookings?.length ? `- Recent bookings: ${userContext.recentBookings.length} bookings` : '- No recent bookings'}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team directly.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm experiencing technical difficulties right now. Please try again in a moment, or contact our support team at support@yourtravelsearch.com for immediate assistance.";
  }
}

export async function generateQuickResponses(userMessage: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: 'system',
          content: 'Generate 3 short, helpful quick response suggestions for a Duffel-powered travel booking platform. Focus on live flight data, booking management, and Duffel-specific features. Each should be 2-6 words. Return as JSON array of strings in format {"suggestions": ["text1", "text2", "text3"]}'
        },
        {
          role: 'user',
          content: `User message: "${userMessage}"`
        }
      ],
      max_tokens: 100,
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"suggestions": []}');
    return result.suggestions || [];
  } catch (error) {
    console.error("Error generating quick responses:", error);
    return ["Check live pricing", "View booking", "Cancel flight"];
  }
}