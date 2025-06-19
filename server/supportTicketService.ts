import { db } from "./db";
import { supportTickets, supportMessages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface SupportTicketData {
  userId: number;
  subject: string;
  category: string;
  priority: string;
  description: string;
}

export interface SupportMessageData {
  ticketId: number;
  senderId: number;
  senderType: string;
  message: string;
}

// Generate unique ticket number
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4);
  return `TRV-${timestamp}-${random}`.toUpperCase();
}

export class SupportTicketService {
  async createTicket(ticketData: SupportTicketData) {
    const ticketNumber = generateTicketNumber();
    
    const [ticket] = await db.insert(supportTickets).values({
      ...ticketData,
      ticketNumber,
      status: 'open',
    }).returning();

    return ticket;
  }

  async getUserTickets(userId: number) {
    return await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.userId, userId))
      .orderBy(desc(supportTickets.createdAt));
  }

  async getTicket(ticketId: number) {
    const [ticket] = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.id, ticketId));
    
    return ticket;
  }

  async updateTicketStatus(ticketId: number, status: string) {
    const [ticket] = await db
      .update(supportTickets)
      .set({ 
        status,
        updatedAt: new Date(),
        ...(status === 'resolved' ? { resolvedAt: new Date() } : {})
      })
      .where(eq(supportTickets.id, ticketId))
      .returning();

    return ticket;
  }

  async addMessage(messageData: SupportMessageData) {
    const [message] = await db
      .insert(supportMessages)
      .values(messageData)
      .returning();

    return message;
  }

  async getTicketMessages(ticketId: number) {
    return await db
      .select()
      .from(supportMessages)
      .where(eq(supportMessages.ticketId, ticketId))
      .orderBy(supportMessages.createdAt);
  }
}

export const supportTicketService = new SupportTicketService();