import React, { FormEvent, useState } from "react";
import Dropdown from 'react-dropdown';
import styles from './gpt.module.css'
import 'react-dropdown/style.css';
import { TextCompletionsResponseData } from "../api/text";
import { configuration, openai } from "../api/common";
import { ChatCompletionsResponseData } from "../api/chat";

type Item = {
    label: string,
    value: string
}

type Props = {
    allModels: string[],
    error: string
}

type Input = {
    gptType: string,
    availableModels: string[],
    selectedModel: string,
    prompt: string
}

enum GptType {
    TEXT = 'text',
    CHAT = 'chat',
}

const gptTypes = [GptType.TEXT, GptType.CHAT];

const textModels = ['text-davinci-003', 'text-davinci-002', 'text-curie-001', 'text-babbage-001', 'text-ada-001'];
const chatModels = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301'];

const GptPage = ({ allModels = [], error = '' }: Props) => {
    const filterModels = (gptType: string): string[] => allModels.filter(model => {
        switch (gptType) {
            case GptType.TEXT:
                return textModels.includes(model);
            case GptType.CHAT:
                return chatModels.includes(model);
            default:
                return false;
        }
    });

    const [generatedText, setGeneratedText] = useState("");
    const defaultPrompt = 'Suggest a name for my ragdoll cat';
    const [input, setInput] = useState<Input>({
        gptType: GptType.TEXT,
        availableModels: filterModels(GptType.TEXT),
        selectedModel: filterModels(GptType.TEXT)[0],
        prompt: defaultPrompt});

    const selectGptType = (item: Item) => {
        setInput({
            ...input,
            gptType: item.value,
            availableModels: filterModels(item.value),
            selectedModel: filterModels(item.value)[0],
        });
    }

    const generateResponse = async (e: FormEvent) => {
        e.preventDefault();

        const response = await fetch(input.gptType === GptType.TEXT ? '/api/text' : '/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: input.prompt,
                model: input.selectedModel
            })
        });

        const data: TextCompletionsResponseData | ChatCompletionsResponseData = await response.json();

        setGeneratedText(data.result || data.error);
    }

    const setModel = (item: Item) => {
        setInput({
            ...input,
            selectedModel: item.value
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
        <Dropdown options={gptTypes} placeholder='Select a gpt type' onChange={selectGptType} className={styles.dropdown} value={input.gptType} />
        <form onSubmit={generateResponse} className={styles.formHolder}>
            <div className={styles.promptHolder}>
                <textarea onChange={setPrompt} className={styles.prompt} value={input.prompt} style={{height: input.gptType === GptType.CHAT ? '300px' : '100px'}}/>
            </div>
            <div className={styles.models}>
                {error || <Dropdown options={input.availableModels} onChange={setModel} placeholder='Select a model' className={styles.dropdown} value={input.selectedModel} />}
            </div>
            <div>
                <input type="submit" disabled={!input.prompt || !input.selectedModel}/>
            </div>
        </form>
        Generated answer: {generatedText && <p>{generatedText}</p>}
    </div>
    );
};

export async function getServerSideProps() {
    if (!configuration.apiKey) {
        return {
            props: {
                error: 'OpenAI API key not configured. Please create a .env file and set REACT_APP_OPENAI_API_KEY to your open AI API key.'
            }
        };
    }

    const response = await openai.listModels();
    const allModels = response.data.data.map(model => model.id);
    return {
        props: {
            allModels,
        }
    }
}

export default GptPage;