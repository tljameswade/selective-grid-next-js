import React, { FormEvent, useState } from "react";
import axios from 'axios';
import Dropdown from 'react-dropdown';
import styles from './gpt.module.css'
import 'react-dropdown/style.css';

interface PostPromptResponse {
  choices: { text: string }[];
}

interface ListModelsResponse {
    data: Model[]
}

type Model = {
    id: string,
    object: string,
    permission: PermissionUnit[]
}

type Item = {
    label: string,
    value: string
}

type PermissionUnit = {
    allow_sampling: boolean
}

type Headers = {
    Authorization: string,
    'Content-Type': string,
};

type Props = {
    headers: Headers,
    models: string[],
}

type Input = {
    model: string,
    prompt: string
}

const GptPage = ({ headers, models }: Props) => {
    const [generatedText, setGeneratedText] = useState("");
    const defaultPrompt = 'Suggest a name for my ragdoll cat';
    const defaultModelIndex = models.findIndex(model => model === 'text-davinci-003') || 0;
    const [input, setInput] = useState<Input>({model: models[defaultModelIndex], prompt: defaultPrompt});

    const generateResponse = async (e: FormEvent) => {
        e.preventDefault();
        const result = await makePromptRequest(input, headers);
        setGeneratedText(result);
    }

    const setModel = (item: Item) => {
        setInput({
            ...input,
            model: item.value
        });
    };

    const setPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput({
            ...input,
            prompt: e.target.value
        });
    }

    return (
    <div className={styles.holder}>
        <form onSubmit={generateResponse} className={styles.formHolder}>
            <div className={styles.promptHolder}>
                <textarea onChange={setPrompt} className={styles.prompt} value={input.prompt} />
            </div>
            <Dropdown options={models} onChange={setModel} placeholder='Select a model' className={styles.dropdown} value={models[defaultModelIndex]} />
            <div>
                <input type="submit" disabled={!input.prompt || !input.model}/>
            </div>
        </form>
        Generated answer: {generatedText && <p>{generatedText}</p>}
    </div>
    );
};

const makePromptRequest = async (input: Input, headers: Headers): Promise<string> => {
    try {
        const response = await axios.post<PostPromptResponse>(
            "https://api.openai.com/v1/completions",
            {
            prompt: input.prompt,
            model: input.model,
            max_tokens: 60,
            n: 1,
            stop: null,
            temperature: 0.5,
            },
            {headers}
        );
    
        return response.data.choices[0].text;
    } catch (error) {
        return 'An error happens when querying the openAI API. This may due to the model you selected is not supported for v1/completions endpoint. Please try a different model.';
    }
}

export async function getStaticProps() {
    const headers = {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
    };
    const listModelsResponse = await axios.get<ListModelsResponse>(
        'https://api.openai.com/v1/models',
        {headers}
    );
    const models = listModelsResponse.data.data.filter(model => model.permission.find(unit => unit.allow_sampling)).map(model => model.id);
    return {
        props: {
            headers,
            models,
        }
    }
}

export default GptPage;
