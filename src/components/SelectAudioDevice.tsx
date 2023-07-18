import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useAudioDevices} from '../hooks/useAudioDevices';
import AudioDeviceList from './AudioDeviceList';
import {Box, Button, ButtonGroup} from "@chakra-ui/react";
import {Container} from "./Container";
import VolumeIndicator from "./VolumeIndicator";

interface SelectAudioDeviceProps {
    onSendRecordAudio: (audio: Blob) => Promise<void>;
}

let chunks: BlobPart[] = [];

const SelectAudioDevice = ({onSendRecordAudio }: SelectAudioDeviceProps) => {
    const audioPreviewRef = useRef<HTMLAudioElement>();
    const [audioDeviceState, audioDevicesActions, audioBlob] = useAudioDevices(audioPreviewRef);
    const [sending, setSending] = useState(false);

    const {
        deviceList,
        recordState,
    } = audioDeviceState;

    useEffect(() => {
        if (!audioPreviewRef.current) return

        if (audioBlob) {
            audioPreviewRef.current.src = URL.createObjectURL(audioBlob);
        } else {
            audioPreviewRef.current.src = '';
            audioPreviewRef.current.pause();
        }

        return () => {
            if (!audioPreviewRef.current) return
            audioPreviewRef.current.src = '';
            audioPreviewRef.current.pause();
        }
    }, [audioBlob]);

    const handleChangeAudioInputDevice = (deviceId: string) => {
        console.log('select device', deviceId);
        audioDevicesActions.selectDevice(deviceId);
    };

    const handleSendRecordedAudio = async () => {
        if (!audioBlob) return;
        setSending(true);
        try {
            await onSendRecordAudio(audioBlob);
            audioDevicesActions.deleteRecord();
        } finally {
            setSending(false);
        }
    }

    const isRecording = recordState === 'recording';
    const canPlay = audioBlob !== null;

    return (
        <Container>
            <Box width="full">
                <audio ref={audioPreviewRef}></audio>
                <AudioDeviceList
                    devices={deviceList}
                    onChange={handleChangeAudioInputDevice}
                ></AudioDeviceList>
                <VolumeIndicator stream={audioDeviceState.stream} />
            </Box>
            <ButtonGroup>
                <Button
                    onClick={() => audioDevicesActions.startRecord()}
                    disabled={isRecording}
                >Record</Button>
                <Button
                    onClick={() => audioDevicesActions.stopRecord()}
                    disabled={!isRecording}
                >Stop</Button>
                <Button disabled={isRecording || !canPlay} onClick={() => audioPreviewRef.current.play()}>Play</Button>
                <Button
                    disabled={isRecording || !canPlay || sending} isLoading={sending}
                    onClick={handleSendRecordedAudio}
                >Send</Button>
            </ButtonGroup>
        </Container>
    );
};

export default SelectAudioDevice;
