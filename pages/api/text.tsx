import { NextApiRequest, NextApiResponse } from 'next';
import { openai } from './common';

export type TextCompletionsResponseData = {
    result?: string,
    error?: string
}

export default async function (req: NextApiRequest, res: NextApiResponse<TextCompletionsResponseData>) {
    const prompt = req.body.prompt || '';
    const model = req.body.model || '';

    if (prompt.trim() === '') {
        res.status(400).json({
            error: 'Please enter a valid prompt for text completion'
        });
        return;
    }

    if (model.trim() === '') {
        res.status(400).json({
            error: 'Please select a valid model for text completion'
        });
        return;        
    }

    try {
        const completion = await openai.createCompletion({
            model,
            prompt,
            temperature: 0.7,
            max_tokens: 200,
        });
        res.status(200).json({
            result: completion.data.choices[0].text
        });
    } catch(error) {
        res.status(500).json({
            error: 'An error has occurred during your request for text completion.'
        });
    }
}