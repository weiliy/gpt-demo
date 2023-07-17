import React, {useEffect, useState} from "react";
import {Progress} from "@chakra-ui/react";
import SoundMeter from "../hooks/soundmeter";

const VolumeIndicator = ({ stream }) => {
    const [volume, setVolume] = useState(0);
    useEffect(() => {
        if (!stream) return;

        const audioContext = new AudioContext();
        const soundMeter = new SoundMeter(audioContext);

        let meterRefresh = null;
        soundMeter.connectToSource(stream, function(e) {
            if (e) {
                alert(e);
                return;
            }
            meterRefresh = setInterval(() => {
                setVolume(soundMeter.instant);
            }, 200);
        });

        return () => {
            if (meterRefresh) {
                soundMeter.stop();
                audioContext.close();
                clearInterval(meterRefresh)
            };
        }

    }, [stream])


    const volumePercent = volume * 100;
    let volumeColor;
    if (volumePercent > 80) {
        volumeColor = "red";
    } else if (volumePercent > 50) {
        volumeColor = "yellow";
    } else if (volumePercent > 20) {
        volumeColor = "orange";
    } else {
        volumeColor = "green";
    }

    return (
        <Progress colorScheme={volumeColor} value={volumePercent} />
    );
};

export default VolumeIndicator;