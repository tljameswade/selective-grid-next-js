import {Configuration, OpenAIApi} from 'openai';

export const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
});

export const openai = new OpenAIApi(configuration);