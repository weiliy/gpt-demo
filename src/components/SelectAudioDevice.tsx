import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useGetDevices} from '../hooks/useGetDevices';
import AudioDeviceList from './AudioDeviceList';
import {Box, Button, ButtonGroup} from "@chakra-ui/react";
import {Container} from "./Container";

interface SelectAudioDeviceProps {
    onDeviceChanged: (devices: {
        audioInput?: MediaDeviceInfo;
    }) => void;
}

const SelectAudioDevice = ({onDeviceChanged}: SelectAudioDeviceProps) => {
    const [devices, getDevices] = useGetDevices();
    const [audioInputDevice, setAudioInputDevice] = useState<MediaDeviceInfo>();

    const audioPreviewRef = useRef<
        HTMLAudioElement & {
        setSinkId(deviceId: string): Promise<void>;
    }
    >();
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const [isRecordingButtonDisabled, setIsRecordingButtonDisabled] = useState(false);

    const audioInputDevices = useMemo(() => devices.filter((d) => d.kind === 'audioinput'), [devices]);

    useEffect(() => {
        getDevices();

        return () => {
            beforeCloseModal()
        }
    }, []);

    useEffect(() => {
        handleConfirmClick()
    }, [audioInputDevice])

    const beforeCloseModal = () => {
        if (!recorder || !audioPreviewRef) return;

        if (recorder.state === 'recording') {
            recorder.removeEventListener('dataavailable', () => {
            });
            recorder.removeEventListener('stop', () => {
            });
            recorder.stop();
            recorder.stream.getTracks().forEach((t) => t.stop());
        }
        audioPreviewRef.current.src = '';
        audioPreviewRef.current.pause();
    };

    const handleConfirmClick = () => {
        beforeCloseModal();
        onDeviceChanged({
            audioInput: audioInputDevice !== undefined ? audioInputDevice : audioInputDevices[0],
        });
    };

    const handleChangeAudioInputDevice = (deviceId: string) => {
        setAudioInputDevice(audioInputDevices.find((d) => d.deviceId === deviceId));
    };

    const handleRecordingClick = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:
                audioInputDevice && audioInputDevice.deviceId !== ''
                    ? {
                        deviceId: audioInputDevice.deviceId,
                    }
                    : true,
            video: false,
        });
        let chunks: BlobPart[] = [];
        const _recorder = new MediaRecorder(stream);
        _recorder.addEventListener('dataavailable', (e) => {
            chunks.push(e.data);
        });
        _recorder.addEventListener('stop', async () => {
            setIsRecordingButtonDisabled(false);
            if (!audioPreviewRef.current) return;

            const blob = new Blob(chunks, {type: 'audio/ogg; codecs=opus'});
            chunks = [];
            audioPreviewRef.current.src = URL.createObjectURL(blob);
        });
        _recorder.start();
        setRecorder(_recorder);
        setIsRecordingButtonDisabled(true);
        setTimeout(() => {
            _recorder.stop();
            stream.getTracks().forEach((t) => t.stop());
        }, 5000);
    };


    return (
        <Container>
            <Box>
                <audio ref={audioPreviewRef} autoPlay></audio>
                <>
                    <AudioDeviceList
                        label="Microphone"
                        devices={audioInputDevices}
                        onChange={handleChangeAudioInputDevice}
                    ></AudioDeviceList>
                </>
            </Box>
            <ButtonGroup>
                <Button
                    onClick={handleRecordingClick}
                    disabled={isRecordingButtonDisabled}
                >
                    {isRecordingButtonDisabled ? 'Recording...' : 'Record'}
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default SelectAudioDevice;
