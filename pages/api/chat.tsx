import { NextApiRequest, NextApiResponse } from 'next';
import { openai } from './common';

export type ChatCompletionsResponseData = {
    result?: string,
    error?: string
}

// Call open AI's chat completion's API end point with messages in the request.
export default async function (req: NextApiRequest, res: NextApiResponse<ChatCompletionsResponseData>) {
    const messages = req.body.messages || [];
    const model = req.body.model || '';

    if (messages.length === 0) {
        res.status(400).json({
            error: 'Please enter a valid message for chat completion'
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
            messages,
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