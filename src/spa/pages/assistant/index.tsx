import {
    Box,
    SimpleGrid,
    ActionIcon,
    Flex,
    ScrollArea,
    Image,
    Container,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { UseAssistant } from "./state";

import { assistantChatRequest, UseAssistantRequest } from "./assisChatRequest";
import { Message } from "./messageComp";
import { ContinuesMatchMaxWidth } from "@/utils";
import { CTextInput } from "@/CustomComponents/CTextInput";
import { ActionIconBtn } from "@/drySystems/ActionIconBtn";

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
        <Box h="calc(100vh - calc(170px + 0px))">
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
        <Box>
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

    // const scrollToTop = () =>
    //     viewport.current?.scrollTo({ top: 0, behavior: "smooth" });

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
                height: "calc(100vh - 55px)",
            })}
        >
            {/* <Flex justify={"center"}>
                <Image
                    width={150}
                    src={
                        "https://media.discordapp.net/attachments/1082403461808803860/1092145471910334625/image.png?width=902&height=897"
                    }
                />
            </Flex> */}
            <ScrollArea viewportRef={viewport} mb="lg">
                <AssistantMessagesArea scrollToBottom={scrollToBottom} />
            </ScrollArea>
            <AssistantChatbox scrollToBottom={scrollToBottom} />
        </Container>
    );
}
