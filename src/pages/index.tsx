import {Container} from '../components/Container'
import {Main} from '../components/Main'
import SelectAudioDevice from "../components/SelectAudioDevice";
import React from "react";
import {DarkModeSwitch} from "../components/DarkModeSwitch";

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
            <DarkModeSwitch/>
        </Container>
    )
}

export default Index
