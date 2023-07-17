import React from 'react';

interface DeviceItemProps {
    name: string;
    value: string;
}

const AudioDeviceItem = ({ name, value }: DeviceItemProps) => {
    return <option value={value}>{name}</option>;
};

export default AudioDeviceItem;
