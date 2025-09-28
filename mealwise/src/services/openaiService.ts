import { GroceryItem, GroceryCategory } from '@/types/grocery';

export interface OpenAIResponse {
  items: Omit<GroceryItem, 'id'>[];
  message: string;
  totalCost: number;
}

export interface NotesAndGroceryResponse {
  items: Omit<GroceryItem, 'id'>[];
  message: string;
  totalCost: number;
  notesUpdate?: string;
}

export class OpenAIService {
  async generateGroceryList(prompt: string, currentItems: GroceryItem[] = []): Promise<OpenAIResponse> {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          currentItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate grocery list. Please try again.');
    }
  }

  async getMealPlan(budget: number, servings: number, dietaryRestrictions: string[] = []): Promise<OpenAIResponse> {
    const prompt = `Plan ${servings} servings of meals for $${budget} budget. ${dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}.` : ''} Include breakfast, lunch, and dinner options.`;
    return this.generateGroceryList(prompt);
  }

  async suggestAlternatives(itemName: string, maxPrice: number): Promise<OpenAIResponse> {
    const prompt = `Suggest budget-friendly alternatives to ${itemName} under $${maxPrice}. Include similar items that are cheaper.`;
    return this.generateGroceryList(prompt);
  }

  async modifyList(action: string, currentItems: GroceryItem[]): Promise<OpenAIResponse> {
    const prompt = `${action}. Current list: ${currentItems.map(item => item.name).join(', ')}`;
    return this.generateGroceryList(prompt, currentItems);
  }

  async processNotesAndGrocery(prompt: string, currentItems: GroceryItem[] = [], currentNotes: string = ''): Promise<NotesAndGroceryResponse> {
    try {
      const response = await fetch('/api/openai-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          currentItems,
          currentNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      // Get the plain text response
      const notesContent = await response.text();
      
      return {
        items: [],
        message: 'Notes updated successfully',
        totalCost: 0,
        notesUpdate: notesContent
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to process notes and grocery list. Please try again.');
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
