import {Container} from '../components/Container'
import {Main} from '../components/Main'
import SelectAudioDevice from "../components/SelectAudioDevice";
import React, {useState} from "react";
import {DarkModeSwitch} from "../components/DarkModeSwitch";
import {Heading} from "@chakra-ui/react";
import type {AudioPromptResponse} from "./api/audioPrompt";
import {ChatHistory} from "../components/ChatHistory";
import {ControlPanel} from "../components/ControlPanel";
import {chatByAudio} from "../services/chatClient";

const Index = () => {

    const [chatHistory, setChatHistory] = useState<AudioPromptResponse[]>([]);

    const sendAudio = async (audio: Blob) => {
        const {input, output, mode} = await chatByAudio(audio);
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
