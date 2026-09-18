export type Ticket = {
  id: number;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string | null;
  priority: string | null;
  sentiment: string | null;
  aiReasoning: string | null;
  status: string;
  createdAt: string;
};