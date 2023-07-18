import type {AudioPromptResponse} from "../pages/api/audioPrompt";
import React from "react";
import {Box, Flex, HStack, List, ListIcon, ListItem, Stack, Text, useToken} from "@chakra-ui/react";
import {IconMoodHappy, IconMoodNeutral, IconMoodSad, IconRobot} from "@tabler/icons-react";

const MoodIcon = ({ color, mode }: { color: string, mode: AudioPromptResponse['mode']}) => {
    const [happyColor, sadColor, neutralColor] = useToken("colors", ["yellow.300", "blue.300", "gray.300"]) // ["#FFD700", "#1E90FF", "#808080"
    let icon;
    let moodColor;
    switch (mode) {
        case 'happy':
            icon = <IconMoodHappy color={color}/>;
            moodColor = happyColor;
            break;
        case 'sad':
            icon = <IconMoodSad color={color}/>;
            moodColor = sadColor;
            break;
        case 'neutral':
        default:
            icon = <IconMoodNeutral color={color}/>;
            moodColor = neutralColor;
    }
    return (
        <Box borderColor={moodColor} borderRadius={50} border="solid 1px" boxShadow={`1px 1px 1.5px 2px ${moodColor}`}>
            {icon}
        </Box>
    );
}

const Conversation = ({ input, output, mode }: AudioPromptResponse) => {
    const [robotColor, humanColor] = useToken("colors", ["red.300", "blue.800"])

    return (
    <ListItem>
        <Stack spacing={2}>
            <Flex color={humanColor} flexDir="row-reverse" marginLeft="3rem" p="0.5rem"
                  borderRight="solid 2px" borderRadius={10} borderColor={"gray.300"}>
                <Box w="2rem"><MoodIcon color={humanColor} mode={mode}/></Box>
                <Box>
                    <Text variant='text'>{input}</Text>
                </Box>
            </Flex>
            <Flex color={robotColor} flexDir="row" marginRight='3rem' p="0.5rem"
                  borderLeft="solid 1px" borderRadius={10} borderColor={"gray.300"}>
                <Box w="2rem">
                    <IconRobot color={robotColor}/>
                </Box>
                <Box>
                    <Text>{output}</Text>
                </Box>
            </Flex>
        </Stack>
    </ListItem>
    )
}

export function ChatHistory(props: { history: AudioPromptResponse[] }) {
    return (
        <List spacing={3} px='2rem'>
            {props.history.map((item, index) => {
                return (
                    <Conversation key={index} {...item}/>
                )
            })}
        </List>
    )
}