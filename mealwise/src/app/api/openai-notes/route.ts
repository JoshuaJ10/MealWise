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

    const systemPrompt = `You are a Cedar AI assistant that has full control over the user's notes interface. You can:

1. **Parse existing notes** and understand their content
2. **Completely rewrite notes** based on user requests
3. **Add, modify, or remove content** as needed
4. **Format content** with proper structure and organization
5. **Create meal plans, shopping lists, recipes, and more** directly in the notes

Current notes content:
${currentNotes}

You have FULL CONTROL over the notes. When the user makes a request, respond with ONLY the updated notes content. Do NOT include any JSON formatting, brackets, or additional text.

IMPORTANT RULES:
- Respond with ONLY the notes content that should replace the entire notes area
- Use proper formatting with dashes (-) for lists
- Be creative and helpful with content organization
- For meal planning, include both the meal plan AND shopping list in the notes
- For shopping lists, format as organized lists with categories
- Make the notes useful and well-structured
- NO JSON, NO brackets, NO additional formatting - just the notes content

Example response for meal planning:
- WEEKLY MEAL PLAN
- Monday: Chicken Breast with Rice and Vegetables
- Tuesday: Spaghetti with Ground Beef and Tomato Sauce  
- Wednesday: Rice Bowl with Mixed Vegetables
- Thursday: Pasta with Chicken and Vegetables
- Friday: Beef Stir Fry with Rice

- SHOPPING LIST
- Meat:
  - Chicken Breast (2 lbs)
  - Ground Beef (1 lb)
- Pantry:
  - Spaghetti (1 box)
  - Rice (1 bag)
  - Tomato Sauce (1 jar)
- Vegetables:
  - Mixed Vegetables (2 bags)
  - Fresh Vegetables (assorted)

- ESTIMATED COST: $75-80`;

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
