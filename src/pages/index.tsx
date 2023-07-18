import {Container} from '../components/Container'
import {Main} from '../components/Main'
import SelectAudioDevice from "../components/SelectAudioDevice";
import React, {useState} from "react";
import {DarkModeSwitch} from "../components/DarkModeSwitch";
import {Heading} from "@chakra-ui/react";
import type {AudioPromptResponse} from "./api/audioPrompt";
import {ChatHistory} from "../components/ChatHistory";
import {ControlPanel} from "../components/ControlPanel";

const Index = () => {

    const [chatHistory, setChatHistory] = useState<AudioPromptResponse[]>([]);

    const sendAudio = async (audio: Blob) => {
        const formData = new FormData();
        console.log(typeof audio, audio)
        const audioFile = new File([audio], 'audio.ogg', { type: audio.type });
        formData.append('audio', audioFile);
        formData.append('language', 'zh');

        const response : Response = await fetch('/api/audioPrompt', {
            method: 'POST',
            body: formData
        });

        const { input, output, mode } : AudioPromptResponse = await response.json();
        setChatHistory((history) => [...history, { input, output, mode }]);
    }

    return (
        <Container height="100vh">
            <Heading>GTP Demo</Heading>
            <Main>
                <ChatHistory history={chatHistory}/>
            </Main>
            <ControlPanel>
                <SelectAudioDevice
                    onSendRecordAudio={sendAudio}
                ></SelectAudioDevice>
            </ControlPanel>
            <DarkModeSwitch/>
        </Container>
    )
}

export default Index
