import React from 'react';
import AudioDeviceItem from "./AudioDeviceItem";
import {FormLabel, Select} from "@chakra-ui/react";

interface DeviceListProps {
    devices: MediaDeviceInfo[];
    label: string;
    onChange: (deviceId: string) => void;
}

const DeviceList = ({ devices, label, onChange }: DeviceListProps) => {
    if (devices === undefined) return <></>;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <>
            <FormLabel>{label}</FormLabel>
            <Select onChange={handleChange}>
                {devices.map((d, i) => (
                    <AudioDeviceItem value={d.deviceId} name={d.label} key={i}></AudioDeviceItem>
                ))}
            </Select>
        </>
    );
};

export default DeviceList;
