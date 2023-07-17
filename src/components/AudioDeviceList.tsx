import React, {useEffect} from 'react';
import AudioDeviceItem from "./AudioDeviceItem";
import {FormLabel, Select} from "@chakra-ui/react";

interface DeviceListProps {
    devices: MediaDeviceInfo[];
    onChange: (deviceId: string) => void;
}

const DeviceList = ({ devices, onChange }: DeviceListProps) => {

    const [selectedDeviceId, setSelectedDeviceId] = React.useState<string>(undefined);

    useEffect(() => {
        if (devices || devices.length > 0 && selectedDeviceId === undefined) {
            onChange(devices[0].deviceId);
        }
    }, [devices])

    const handleChange = (deviceId) => {
        setSelectedDeviceId(deviceId)
        onChange(deviceId);
    };

    if (devices === undefined) return <></>;

    return (
        <Select onChange={e => handleChange(e.target.value)} value={selectedDeviceId}>
            {devices.map((d, i) => (
                <AudioDeviceItem value={d.deviceId} name={d.label} key={i}></AudioDeviceItem>
            ))}
        </Select>
    );
};

export default DeviceList;
