import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GroceryItem, GroceryCategory } from '@/types/grocery';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIResponse {
  items: Omit<GroceryItem, 'id'>[];
  message: string;
  totalCost: number;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentItems = [] } = await request.json();

    console.log('Environment check:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an AI grocery shopping assistant. You help users plan meals and create grocery lists.

Current grocery list:
${currentItems.map((item: GroceryItem) => `- ${item.name} (${item.quantity}x) - $${item.price.toFixed(2)} each`).join('\n')}

When the user asks for meal planning, grocery suggestions, or list modifications, respond with a JSON object containing:
{
  "items": [
    {
      "name": "Item Name",
      "quantity": 1,
      "price": 2.99,
      "category": "Produce|Dairy|Frozen|Pantry|Meat|Bakery|Beverages|Snacks|Other",
      "brand": "Brand Name (optional)",
      "isChecked": false,
      "notes": "Optional notes"
    }
  ],
  "message": "Human-readable explanation of what you added/changed",
  "totalCost": 25.99
}

Categories: Produce, Dairy, Frozen, Pantry, Meat, Bakery, Beverages, Snacks, Other
Use realistic prices for grocery items.
Be helpful and suggest complete meal plans when requested.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        items: parsed.items || [],
        message: parsed.message || 'Items added to your grocery list',
        totalCost: parsed.totalCost || 0,
      });
    } catch (parseError) {
      // If JSON parsing fails, return a fallback response
      return NextResponse.json({
        items: [],
        message: content,
        totalCost: 0,
      });
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate grocery list. Please try again.' },
      { status: 500 }
    );
  }
}
