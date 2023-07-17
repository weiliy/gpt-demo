import {Text,} from '@chakra-ui/react'
import {Container} from '../components/Container'
import {Main} from '../components/Main'
import SelectAudioDevice from "../components/SelectAudioDevice";
import React from "react";
import {DarkModeSwitch} from "../components/DarkModeSwitch";
import {Footer} from "../components/Footer";

const Index = () => {
    const handleDeviceChanged = (devices) => {
        console.log(devices);
    };

    return (
        <Container height="100vh">
            <Main>
                <SelectAudioDevice
                    onDeviceChanged={handleDeviceChanged}
                ></SelectAudioDevice>
            </Main>
            <DarkModeSwitch />
            <Footer>
                <Text>Author: Weili</Text>
            </Footer>
        </Container>
    )
}

export default Index
