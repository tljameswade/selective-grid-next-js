import { NextApiRequest, NextApiResponse } from 'next';
import { openai } from './common';

export type ChatCompletionsResponseData = {
    result?: string,
    error?: string
}

export default async function (req: NextApiRequest, res: NextApiResponse<ChatCompletionsResponseData>) {
    const content = req.body.prompt || '';
    const model = req.body.model || '';

    if (content.trim() === '') {
        res.status(400).json({
            error: 'Please enter a valid prompt for chat completion'
        });
        return;
    }

    if (model.trim() === '') {
        res.status(400).json({
            error: 'Please select a valid model for chat completion'
        });
        return;        
    }

    try {
        const completion = await openai.createChatCompletion({
            model,
            messages: [{
                role: 'user',
                content,
            }],
            temperature: 0.7,
            max_tokens: 500,
            n: 1
        });
        res.status(200).json({
            result: completion.data.choices[0].message.content
        });
    } catch(error) {
        res.status(500).json({
            error: 'An error has occurred during your request for chat completion.'
        });
    }
}