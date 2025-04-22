import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required when using in browser environments
});

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * Get a chat completion from the OpenAI API
 * @param messages Array of messages in the conversation
 * @returns The content of the assistant's response
 */
export async function getChatCompletion(messages: ChatMessage[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao chamar a API da OpenAI:', error);
    throw error;
  }
}
