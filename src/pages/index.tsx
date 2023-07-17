import {Container} from '../components/Container'
import {Main} from '../components/Main'
import SelectAudioDevice from "../components/SelectAudioDevice";
import React, {useEffect, useState} from "react";
import {DarkModeSwitch} from "../components/DarkModeSwitch";
import {Heading} from "@chakra-ui/react";

import { io, type Socket } from "socket.io-client";
let socket: Socket | null = null;


const Index = () => {
    useEffect(() => {
        socketInitializer();
    }, [])

    const socketInitializer = async () => {
        if (!socket) {
            console.log('call socket initializer');
            await fetch("/api/socket");
            socket = io({ path: "/api/socket" });

            socket.on("connect", () => {
                console.log("############# connected");
            });

            socket.on("hello", (msg: string) => {
                console.log("hello", msg);
            });

            socket.on("userServerConnection", () => {
                console.log("a user connected (client)");
            });

            socket.on("userServerDisconnection", (socketid: string) => {
                console.log(socketid);
            });
        }

        return () => {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        };
    }

    return (
        <Container height="100vh">
            <Main>
                <Heading>GTP Demo</Heading>
                <SelectAudioDevice
                    onSendRecordAudio={async (audio) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                alert('Audio sent');
                                resolve();
                            }, 1000);
                        })
                    }}
                ></SelectAudioDevice>
            </Main>
            <DarkModeSwitch/>
        </Container>
    )
}

export default Index
