import Anthropic from '@anthropic-ai/sdk';
import { SubmitProjectData } from '../types';

export interface AIReviewResult {
  score: number;
  feedback: string;
  isApproved: boolean;
}

export async function reviewProject(
  projectData: SubmitProjectData,
  apiKey: string
): Promise<AIReviewResult> {
  if (!apiKey) {
    throw new Error('API Key is required for AI review');
  }

  try {
    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
    });

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Please review this free project submission and provide a detailed assessment:

Project Name: ${projectData.name}
Description: ${projectData.description}
URL: ${projectData.url}
Category: ${projectData.category}
Tags: ${projectData.tags.join(', ')}

Please evaluate:
1. Is this a legitimate free tool/project?
2. Is the description clear and helpful?
3. Is the URL valid and safe?
4. Does it match the selected category?
5. Overall quality and usefulness

Provide a score from 0-100 and specific feedback. Format your response as JSON:
{
  "score": <number 0-100>,
  "feedback": "<detailed feedback>",
  "isApproved": <boolean>
}

A score above 60 should be approved.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      // Try to extract JSON from the response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          score: result.score,
          feedback: result.feedback,
          isApproved: result.isApproved,
        };
      }
    }

    // Fallback if no JSON found
    return {
      score: 50,
      feedback: 'Unable to parse AI review response. Manual review recommended.',
      isApproved: false,
    };
  } catch (error) {
    console.error('AI review error:', error);
    throw new Error('Failed to get AI review. Please check your API key and try again.');
  }
}
