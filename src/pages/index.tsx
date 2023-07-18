import {Container} from '../components/Container'
import {Main} from '../components/Main'
import SelectAudioDevice from "../components/SelectAudioDevice";
import React, {useEffect, useState} from "react";
import {DarkModeSwitch} from "../components/DarkModeSwitch";
import {Heading} from "@chakra-ui/react";
import {encodeToBase64} from "next/dist/build/webpack/loaders/utils";
import type {AudioPromptResponse} from "./api/audioPrompt";

const Index = () => {

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

        const { input, output, mood} = await response.json();
        console.log(input, output, mood);
    }

    return (
        <Container height="100vh">
            <Main>
                <Heading>GTP Demo</Heading>
                <SelectAudioDevice
                    onSendRecordAudio={sendAudio}
                ></SelectAudioDevice>
            </Main>
            <DarkModeSwitch/>
        </Container>
    )
}

export default Index
