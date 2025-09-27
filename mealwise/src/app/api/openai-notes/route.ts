import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GroceryItem, GroceryCategory } from '@/types/grocery';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface NotesAndGroceryResponse {
  items: Omit<GroceryItem, 'id'>[];
  message: string;
  totalCost: number;
  notesUpdate?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentItems = [], currentNotes = '' } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const systemPrompt = `Instruction:
You are a shopping list AI. When given a user request, output an organized shopping list only.

Rules:

Start each recipe or item group with a header (e.g., “Lasagna:”).

List ingredients below the header, one per line, starting with a dash.

Include only ingredients needed for the requested dish or preference and the amount.

For general requests (e.g., flavor, budget), pick a suitable recipe.

Do not include greetings, explanations, or any text outside the list.

Do not overwrite or remove any existing items—only append new items.

Examples for reference (do not output these):

User: “I want something savory under $10 for dinner today”
Output:

Savory Stir-Fry:
- Chicken breast (2lb)
- Broccoli (250 g)
- Carrots (150 g)
- Bell peppers (200 g)
- Soy sauce (5 oz)
- Garlic (5 teaspoons)
- Ginger (3 teaspoons)
- Rice (3 cups)
- Vegetable oil (50 ml)

Current notes content (Make sure to include in the new request):
${currentNotes}
Now, generate the shopping list for this request with current notes still included:
`;

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

    // Return the content directly as plain text
    return new Response(content, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process notes and grocery list. Please try again.' },
      { status: 500 }
    );
  }
}
