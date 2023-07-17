import {MutableRefObject, useEffect, useMemo, useRef, useState} from 'react';

interface AudioDevicesState {
    deviceList: MediaDeviceInfo[];
    selectedDevice: MediaDeviceInfo | null;
    volume: number;
    recordState: 'idle' | 'recording' | 'stopped';
    stream?: MediaStream;
}

interface AudioDevicesActions {
    reset: () => void;
    selectDevice: (deviceId: string) => void;
    startRecord: () => void;
    stopRecord: () => void;
    deleteRecord: () => void;
}


function filterOnlyAudioInputDevice(_deviceList: MediaDeviceInfo[]) {
    return _deviceList.filter((d) => d.kind === 'audioinput');
}

const createStream = async (mediaDeviceInfo: MediaDeviceInfo) => {
    const constants = {
        audio:
            mediaDeviceInfo && mediaDeviceInfo.deviceId !== ''
                ? {
                    deviceId: mediaDeviceInfo.deviceId,
                }
                : true,
    };
    return await navigator.mediaDevices.getUserMedia(constants)
}

const createRecorder = (steam: MediaStream) => {
    return new MediaRecorder(steam);
}

export const useAudioDevices = (audioPreviewRef: MutableRefObject<HTMLAudioElement>): [AudioDevicesState, AudioDevicesActions, Blob | null] => {
    const [audioDevicesState, setAudioDevicesState] = useState<AudioDevicesState>({
        deviceList: [],
        selectedDevice: null,
        volume: 0,
        recordState: 'idle',
    });
    const stream = audioDevicesState.stream;
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    useEffect(() => {
        reset();
        console.log('useAudioDevices loaded', audioDevicesState);
    }, []);

    useEffect(() => {
    }, [audioDevicesState.selectedDevice])

    useEffect(() => {
        let chunks: BlobPart[] = [];

        const handleStart = () => {
            chunks = [];
            setAudioBlob(null);
            setAudioDevicesState((prevState) => ({
                ...prevState,
                recordState: 'recording'
            }));
        }
        const handleDataAvailable = (e: BlobEvent) => {
            console.log('blob event', e);
            chunks.push(e.data);
        }
        const handleStop = () => {
            if (!audioPreviewRef.current) return;

            setAudioBlob(new Blob(chunks, {type: 'audio/ogg; codecs=opus'}));
            chunks = [];
            setAudioDevicesState((prevState) => ({
                ...prevState,
                recordState: 'stopped',
            }));
        }

        if (recorder) {
            recorder.addEventListener('start', handleStart);
            recorder.addEventListener('dataavailable', handleDataAvailable);
            recorder.addEventListener('stop', handleStop);
        }

        return () => {
            if (audioDevicesState.recordState === 'recording') {
                stream.getTracks().forEach((t) => t.stop());
                recorder.removeEventListener('dataavailable', handleDataAvailable);
                if (!audioPreviewRef.current) return;

                setAudioBlob(new Blob(chunks, {type: 'audio/ogg; codecs=opus'}));
                recorder.stop();
            }
        }
    }, [recorder])


    const reset = () => {
        (async () => {
            const constraints = {audio: true, video: false};
            const _stream = await navigator.mediaDevices.getUserMedia(constraints);
            const _deviceList = filterOnlyAudioInputDevice(await navigator.mediaDevices.enumerateDevices());
            setAudioDevicesState({
                deviceList: _deviceList,
                selectedDevice: null,
                volume: 0,
                recordState: 'idle',
            });
            _stream.getTracks().forEach((t) => t.stop());
        })();
    };

    const selectDevice = async (deviceId: string) => {
        const selectedDevice =  audioDevicesState.deviceList.find((d) => d.deviceId === deviceId);
        if (!selectedDevice) return;

        const _stream = await createStream(audioDevicesState.selectedDevice);
        const _recorder = createRecorder(_stream);

        setAudioDevicesState((prevState) => ({
            ...prevState,
            selectedDevice,
            recordState: 'stopped',
            stream: _stream,
        }));
        setRecorder(_recorder);
    }

    const startRecord = () => {
        recorder.start()
    }

    const stopRecord = () => {
        recorder.stop()
    }

   const deleteRecord = () => {
        setAudioBlob(null);
    }

    return [
        audioDevicesState,
        {
            reset,
            selectDevice,
            startRecord,
            stopRecord,
            deleteRecord,
        },
        audioBlob,
    ];
};