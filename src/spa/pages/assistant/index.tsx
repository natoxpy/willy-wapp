import { Box, Flex, ScrollArea, Container, Space } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { UseAssistant } from "./state";

import { UseAssistantRequest } from "./assisChatRequest";
import { Message } from "./messageComp";
import { ContinuesMatchMaxWidth } from "@/utils";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { ActionIconBtn } from "@/drySystems/ActionIconBtn";
import { CText } from "@/CustomComponents/CText";
import { CBadge } from "@/CustomComponents/CBadge";
import { useTheme } from "@/themes";

function AssistantMessagesArea({
    scrollToBottom,
}: {
    scrollToBottom: () => void;
}) {
    const { messages } = UseAssistant();
    scrollToBottom();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Box>
            {messages.map((message, index) => {
                if (!message.content) return;
                if (message.role == "system") return;

                let left = message.role == "user";

                let confirmationBox =
                    (message.content as any).type == "confirmationPrompt";

                return (
                    <Message
                        messageRole={message.role}
                        leftUser={left}
                        content={message.content}
                        key={index}
                        hasConfirmationBox={confirmationBox}
                        type="message"
                        isLast={index == messages.length - 1}
                    />
                );
            })}
        </Box>
    );
}

function AssistantChatbox({ scrollToBottom }: { scrollToBottom: () => void }) {
    let messageInput = useRef<HTMLInputElement>(null);
    const { messages, setMessages, loading, setLoading } = UseAssistant();
    const { sendMessage } = UseAssistantRequest();
    const { theme } = useTheme();
    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    const handleSendMessage = async () => {
        if (!messageInput.current) return;
        if (messageInput.current.value.trim() == "") return;
        let message = messageInput.current.value;

        setLoading(true);

        messageInput.current.value = "";
        OnSendMessage(message);
    };

    const OnSendMessage = async (message: string) => {
        setLoading(true);

        const context = [
            ...messages,
            {
                role: "user",
                content: message,
            },
        ];

        setMessages(context as any);
        scrollToBottom();

        await sendMessage(message);
    };

    return (
        <Box
            sx={() => ({
                position: "fixed",
                bottom: 0,
                left: responsiveCalcChange,
                width: `calc(100% - ${responsiveCalcChange}px)`,
                padding: "15px",
                boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
                background: theme.backgroundColor,
            })}
        >
            <CText>
                <CBadge variant="red">
                    there is many problems we are working hard to fix
                </CBadge>
            </CText>

            <Space h={15} />

            <Flex justify={"center"} align="center">
                <CTextInput
                    placeholder="Message for assistant"
                    w="100vw"
                    mr="md"
                    size="md"
                    disabled={loading}
                    autoComplete="off"
                    Cref={messageInput}
                    onKeyUp={async (e) => {
                        if (e.key == "Enter") {
                            handleSendMessage();
                            messageInput.current?.blur();
                        }
                    }}
                ></CTextInput>
                <ActionIconBtn
                    loading={loading}
                    size="2.5em"
                    radius="sm"
                    onClick={async (e) => {
                        handleSendMessage();
                    }}
                >
                    <IconSend></IconSend>
                </ActionIconBtn>
            </Flex>
        </Box>
    );
}

export default function PersonalAssistant() {
    const viewport = useRef<HTMLDivElement>(null);
    const scrollToBottom = () =>
        viewport.current?.scrollTo({
            top: viewport.current.scrollHeight,
            behavior: "smooth",
        });

    const responsiveCalcChange = ContinuesMatchMaxWidth("sm") ? 0 : 329;

    return (
        <Container
            m={0}
            pt="5px"
            sx={() => ({
                width: `calc(100vw - ${responsiveCalcChange}px)`,
                maxWidth: "100vw",
                padding: "25px",
                overflow: "hidden",
                height: "calc(100vh - 50px)",
            })}
        >
            <ScrollArea viewportRef={viewport} mb="lg" h="calc(100vh - 200px)">
                <AssistantMessagesArea scrollToBottom={scrollToBottom} />
            </ScrollArea>
            <AssistantChatbox scrollToBottom={scrollToBottom} />
        </Container>
    );
}
