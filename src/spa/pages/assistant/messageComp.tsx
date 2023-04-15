import { CancelButton } from "@/CustomComponents/buttons/CancelButton";
import { ConfirmButton } from "@/CustomComponents/buttons/ConfirmButton";
import { useTheme } from "@/themes";
import {
    Box,
    Flex,
    Stack,
    ThemeIcon,
    Text,
    Button,
    Space,
    Image,
} from "@mantine/core";
import { IconBrandOpenai, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { assistantChatRequest, UseAssistantRequest } from "./assisChatRequest";
import {
    ChatgptMessageContentType,
    MessageContent,
    MessageRole,
    UseAssistant,
} from "./state";

export function collectContent(
    contentUnk: MessageContent,
    messageRole: MessageRole
) {
    if (messageRole == "user") return contentUnk as string;
    else if (messageRole == "assistant") {
        let message = contentUnk as ChatgptMessageContentType;
        let result = "";

        for (let i = 0; i < message.content.length; i++) {
            result += message.content[i].message;
        }

        return result;
    }

    return contentUnk as string;
}

interface MessageProps {
    leftUser?: boolean;
    content: MessageContent;
    type: "message" | "action";
    messageRole: MessageRole;
    hasConfirmationBox?: boolean;
    isLast: boolean;
}

export function Message({
    leftUser,
    content,
    messageRole,
    hasConfirmationBox,
    isLast,
}: MessageProps) {
    const { theme } = useTheme();
    const { setMessages, setLoading, loading, messages } = UseAssistant();
    const { sendMessage } = UseAssistantRequest();

    let btnOff = !isLast;

    const onClick = async (msg: string) => {
        setLoading(true);

        setMessages((msgs) => [
            ...msgs,
            {
                role: "user",
                content: msg,
            },
        ]);

        await sendMessage(msg);
    };

    return (
        <Flex m="md" mx={0}>
            {!leftUser ? (
                <ThemeIcon mr="xs" size="xl">
                    <IconBrandOpenai />
                </ThemeIcon>
            ) : (
                <ThemeIcon mr="xs" size="xl">
                    <IconUser />
                </ThemeIcon>
            )}

            <Box
                // bg={leftUser ? "teal" : "cyan"}
                bg={
                    leftUser
                        ? theme.chatMessage.userMessage.backgroundColor
                        : theme.chatMessage.botMessage.backgroundColor
                }
                p="sm"
                sx={(mantineTheme) => ({
                    borderRadius: mantineTheme.radius.sm,
                    float: "right",
                    color: leftUser
                        ? theme.chatMessage.userMessage.textColor
                        : theme.chatMessage.botMessage.textColor,
                })}
                w="100%"
            >
                <Stack>
                    <Text>{collectContent(content, messageRole)}</Text>
                    {hasConfirmationBox && (
                        <Flex align={"center"} justify={"center"}>
                            <CancelButton
                                disabled={btnOff}
                                color="red"
                                onClick={async () => {
                                    await onClick(
                                        "I do not give my approval for that action to be performed."
                                    );
                                }}
                            >
                                CANCEL
                            </CancelButton>
                            <Space w="16px" />
                            <ConfirmButton
                                disabled={btnOff}
                                onClick={async () => {
                                    await onClick(
                                        "I give my approval for that action to be performed."
                                    );
                                }}
                            >
                                CONFIRM
                            </ConfirmButton>
                        </Flex>
                    )}
                </Stack>
            </Box>
        </Flex>
    );
}
