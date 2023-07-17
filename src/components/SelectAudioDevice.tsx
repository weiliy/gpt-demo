import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useAudioDevices} from '../hooks/useAudioDevices';
import AudioDeviceList from './AudioDeviceList';
import {Box, Button, ButtonGroup} from "@chakra-ui/react";
import {Container} from "./Container";
import {createSoundDetector} from "../hooks/soundDetector";

interface SelectAudioDeviceProps {
    onDeviceChanged: (devices: {
        audioInput?: MediaDeviceInfo;
    }) => void;
}

let chunks: BlobPart[] = [];

const SelectAudioDevice = ({onDeviceChanged}: SelectAudioDeviceProps) => {
    const audioPreviewRef = useRef<HTMLAudioElement>();
    const [audioDeviceState, audioDevicesActions, audioBlob] = useAudioDevices(audioPreviewRef);

    const {
        deviceList,
        selectedDevice,
        recordState,
    } = audioDeviceState;

    useEffect(() => {
        onDeviceChanged({ audioInput: selectedDevice })
    }, [selectedDevice])

    useEffect(() => {
        if (audioBlob) {
            audioPreviewRef.current.src = URL.createObjectURL(audioBlob);
        }
        return () => {
            audioPreviewRef.current.src = '';
            audioPreviewRef.current.pause();
        }
    }, [audioBlob]);

    const handleChangeAudioInputDevice = (deviceId: string) => {
        console.log('select device', deviceId);
        audioDevicesActions.selectDevice(deviceId);
    };


    const handleStopRecordingClick = () => {
        audioDevicesActions.stopRecord();
    }

    const isRecording = recordState === 'recording';

    return (
        <Container>
            <ButtonGroup>
                <Button
                    onClick={() => audioDevicesActions.startRecord()}
                    disabled={isRecording}
                >Record</Button>
                <Button
                    onClick={() => audioDevicesActions.stopRecord()}
                    disabled={!isRecording}
                >Stop</Button>
            </ButtonGroup>
            <Box width="full">
                <audio ref={audioPreviewRef} autoPlay></audio>
                <AudioDeviceList
                    devices={deviceList}
                    onChange={handleChangeAudioInputDevice}
                ></AudioDeviceList>
            </Box>
        </Container>
    );
};

export default SelectAudioDevice;
