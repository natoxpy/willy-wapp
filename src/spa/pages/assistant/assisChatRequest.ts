import { sendAddMoneyNotification } from "@/drawers/addMoney/drawer";
import { useNotifications } from "@/drySystems/Notification";
import { useAuthUser } from "@/firebase/auth/authUser";
import { useMoneyTransactions, useUserFireStore } from "@/firebase/firestore";
import Joi from "joi";
import {
    ChatgptMessage,
    ChatgptMessageContentType,
    UseAssistant,
} from "./state";

interface assistantChatRequestProps {
    message: string;
    setLoading: (loading: boolean) => void;
    messages: ChatgptMessage[];
    failedReTryMessage?: string;
    depth: number;
}

export async function assistantChatRequest({
    message,
    setLoading,
    messages,
    failedReTryMessage,
    depth,
}: assistantChatRequestProps): Promise<null | ChatgptMessageContentType> {
    if (depth > 5) {
        setLoading(false);
        return null;
    }

    let messageForRequest = {
        role: "user",
        content: `This is a user message, remember to format your response properly.
        The format your response should be like this:
        \`\`\`
        {
            "type": "message",
            "content": [
                {
                    "message": "This is a message",
                    "expression": "happy"
                },
                {
                    "message": "This is another message",
                    "expression": "sad"
                },
            ]
        }
        \`\`\`
        The user prompt: ${message}`,
    };

    if (failedReTryMessage != undefined)
        messageForRequest = {
            role: "system",
            content: failedReTryMessage,
        };

    let assistantRes = await fetch("/api/assistant", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                ...messages.map((msg) => {
                    return {
                        role: msg.role,
                        content: JSON.stringify(msg.content),
                    };
                }),
                messageForRequest,
            ],
        }),
    });

    if (assistantRes.status != 200) {
        setLoading(false);
        console.log("Error: " + assistantRes.status);
        console.log(assistantRes);
        return null;
    }

    let assistantResJson = await assistantRes.json();

    let resultContent = assistantResJson.result.content;

    let schema = Joi.object({
        type: Joi.valid("message", "action", "confirmationPrompt").required(),
        content: Joi.array().items(
            Joi.object({
                message: Joi.string().required(),
                expression: Joi.valid("happy", "sad", "indifferent").required(),
            })
        ),
        actionContent: Joi.any(),
    });
    let parseContent;

    try {
        parseContent = JSON.parse(resultContent);
    } catch (e) {
        console.log("JSON PARSING FAILED: ", e);
        return assistantChatRequest({
            message,
            setLoading,
            messages,
            failedReTryMessage: `Look at this schema and fix your previous response, 
                                "Joi.object({ type: Joi.valid("message", "action").required(),
                                content: Joi.array().items( Joi.object({ message: Joi.string().required(),
                                expression: Joi.valid("happy", "sad", "indifferent").required(), }) ), actionContent: Joi.object({}), });"
                                This error happened because your resonse failed to parse,
                                most likely you You include text outside of the JSON object,
                                don't do that, only include the JSON. Another common error is that you put everything in a ARRAY instead of an OBJECT,
                                and remember don't apoloze or say anything else, ONLY include the JSON. This is what the users said "${message}"`,
            depth: depth + 1,
        });
    }

    console.log(`assistant response: ${JSON.stringify(parseContent, null, 4)}`);

    let schemaVal = schema.validate(parseContent);

    if (schemaVal.error) {
        console.log("JOI VALIDATION FAILED: ", schemaVal.error.message);
        return assistantChatRequest({
            message,
            setLoading,
            messages,
            failedReTryMessage: `Look at this schema and fix your previous response, 
                                "Joi.object({ type: Joi.valid("message", "action").required(),
                                content: Joi.array().items( Joi.object({ message: Joi.string().required(),
                                expression: Joi.valid("happy", "sad", "indifferent").required(), }) ), actionContent: Joi.object({}), });"
                                This error happened because the schema validation failed, remember to follow the JOI schema EXACTLY as I show you,
                                remember to define a TYPE field, and a CONTENT field where the messages go.
                                this is the message error: "${schemaVal.error.message}".
                                and remember don't apoloze or say anything else, ONLY include the JSON. This is what the users said "${message}"`,
            depth: depth + 1,
        });
    } else {
        console.log("depth", depth);
        setLoading(false);
        console.log("success", JSON.parse(resultContent));
        return JSON.parse(resultContent);
    }
}

export function UseAssistantRequest() {
    const { messages, setLoading, setMessages } = UseAssistant();
    const { showNotification } = useNotifications();
    const { user } = useAuthUser();
    const { increaseMoney } = useUserFireStore();
    const { addMoneyTransaction } = useMoneyTransactions();

    return {
        sendMessage: async (msg: string) => {
            setLoading(true);
            const assistantRes = await assistantChatRequest({
                depth: 0,
                message: msg,
                setLoading,
                messages,
            });

            if (assistantRes?.type == "action" && assistantRes.actionContent) {
                if (assistantRes.actionContent.action == "addMoney") {
                    increaseMoney(
                        Number(assistantRes.actionContent.amount ?? 0)
                    );

                    addMoneyTransaction({
                        amount: Number(assistantRes.actionContent.amount ?? 0),
                        tags: [],
                        date: new Date(),
                        userUid: user?.uid ?? "",
                    });

                    sendAddMoneyNotification(
                        showNotification,
                        assistantRes.actionContent.amount ?? 0
                    );
                }

                return;
            }

            setMessages((msgs) => {
                if (assistantRes == null) return msgs;

                return [
                    ...msgs,
                    {
                        role: "assistant",
                        content: assistantRes,
                    },
                ];
            });

            setLoading(false);
        },
    };
}
