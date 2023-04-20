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

type HistoryProps = {
    history: Conversation[]
}

type GeneratedTextProps = {
    text: string
}

type Input = {
    gptType: string,
    availableModels: string[],
    selectedModel: string,
    prompt: string
}

enum Role {
    SYSTEM = 'system',
    USER = 'user',
    ASSISTANT = 'assistant',
}

type Conversation = {
    role: Role,
    content: string,
}

enum GptType {
    TEXT = 'text',
    CHAT = 'chat',
}

const gptTypes = [GptType.TEXT, GptType.CHAT];

// Supported models for text completions. See https://platform.openai.com/docs/models/model-endpoint-compatibility.
const textModels = ['text-davinci-003', 'text-davinci-002', 'text-curie-001', 'text-babbage-001', 'text-ada-001'];

// Supported models for chat completions. See https://platform.openai.com/docs/models/model-endpoint-compatibility.
const chatModels = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301'];

// Chat history react component that renders a history component with provided chat history.
const ChatHistory = ({ history }: HistoryProps) => {
    return (<div>
                Chat history: {history.length > 0 && 
                    history.map((conversation, index) => (
                        <p key={index}>
                            {`${conversation.role}: ${conversation.content}`}
                        </p>
                    ))
                }                
            </div>);
}

// Generated text component that renders generated text with provided generated text.
const GeneratedText = ({ text }: GeneratedTextProps) => {
    return (<div>
        Generated Text:{text && <p>{text}</p>}
    </div>);
}

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
    const defaultPrompt = 'Suggest a name for my ragdoll cat';

    const [chatHistory, setChatHistory] = useState<Conversation[]>([]);
    const [generatedText, setGeneratedText] = useState<string>('');
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

        let response: Response;
        let data: TextCompletionsResponseData | ChatCompletionsResponseData;

        switch(input.gptType) {
            case GptType.TEXT:
                response = await fetch('/api/text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: input.prompt,
                        model: input.selectedModel
                    })
                });
                data = await response.json();
                setGeneratedText(data.result || data.error);
                break;
            case GptType.CHAT:
                const updatedChatHistory = [
                    ...chatHistory,
                    {
                        role: Role.USER,
                        content: input.prompt            
                    }];

                setChatHistory(updatedChatHistory);
                response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messages: updatedChatHistory,
                        model: input.selectedModel
                    })
                });
                data = await response.json();
                setChatHistory([...updatedChatHistory,
                {
                    role: Role.ASSISTANT,
                    content: data.result || data.error
                }]);
                break;   
            default:
                break;
        }
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
                {input.gptType === GptType.CHAT && <ChatHistory history={chatHistory} />}
                {input.gptType === GptType.TEXT && <GeneratedText text={generatedText} />}
            </div>);
};

// Get all available open AI models and return them as props for the page.
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