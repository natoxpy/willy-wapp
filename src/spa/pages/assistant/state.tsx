import { useUserFireStore } from "@/firebase/firestore";
import currency from "currency.js";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

interface AssistantMessage {
    message: string;
    expression: "sad" | "indifferent" | "worry" | "happy" | "enthusiastic";
}

export type UserMessage = string;

export type MessageRole = "user" | "assistant" | "system";

export type ChatgptMessageContentType = {
    type: "message" | "action" | "confirmationPrompt";
    content: AssistantMessage[];
    actionContent?: {
        action: "addMoney";
        amount?: number;
    };
};
export type MessageContent = UserMessage | ChatgptMessageContentType | string;

export interface ChatgptMessage {
    content: MessageContent;
    role: MessageRole;
}

export type AssistantRespondList = AssistantMessage[];

interface AssistantStateContextType {
    messages: ChatgptMessage[];
    setMessages: Dispatch<SetStateAction<ChatgptMessage[]>>;
    messageWaitingForRender: AssistantRespondList | null;
    setMessageWaitingForRender: Dispatch<
        SetStateAction<AssistantRespondList | null>
    >;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const AssistantStateContext = createContext<AssistantStateContextType>({
    messages: [],
    setMessages: (msgs) => {},
    messageWaitingForRender: [],
    setMessageWaitingForRender: (msg) => {},
    loading: false,
    setLoading: () => {},
});

export const UseAssistant = () => useContext(AssistantStateContext);
/*
For some reason sometimes it decided that it has a better idea for how to format the data. 
THAT WHY I SCREAM AT IT TO USE JSON OBJECT, USE A FCKING JSON OBJECT. 
*/
export function AssistantProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const { userDoc, userDocLoaded } = useUserFireStore();

    const [messageWaitingForRender, setMessageWaitingForRender] =
        useState<AssistantRespondList | null>(null);

    const [messages, setMessages] = useState<ChatgptMessage[]>([
        {
            role: "system",
            content: "Waiting for content!",
        },
        // {
        //     role: "system",
        //     content: `
        //     YOUR JOB:
        //     You are a budgetting and financial expert that will help, the users to use this app. More infor in define below.
        //     Try not to talk to the user about things out of topic. Inform them that you are not allow to talk about this unrelated to your job.

        //     THIS IS THE FORMAT YOUR RESPONSES WILL HAVE FROM NOW ON:

        //     From now on you will all your responses you every prompt using a HTTP type format, This will be the format of your response.
        //     But instead of using GET, POST, DELETE or any HTTP method you will use the methods I will define here.
        //     Methods: MESSAGE

        //     EXAMPLE OF A RESPONSE:
        //     \`\`\`
        //     MESSAGE\r\n
        //     \r\n
        //     { RESPONSE CONTENT }
        //     \`\`\`
        //     `,
        // },
        {
            role: "system",
            content: `from now on you will follow the following rules in your responses. NEVER BREAK THIS FORMAT. ALWAYS USE IT. THIS ARE THE FORMATTING RULES YOU MUST FOLLOW. TRYING TO GO AGAINST THEM WILL CASE THE APP TO BREAK, CRASH AND SHUTDOWN.
            If you break it the whole application will crash because it can only handle JSON formatted responses. If you are going to say ANYTHING, do it inside a JSON response.
            I don't want you to explain anything, you will only respond in JSON format, remember to not use \`"\` only use \`\\"\` because using \`"\` inside JSON might break it if you don't use it properly. Respond only using JSON, for no reason, no matter what, never break this rule. This is !IMPORTANT.
            `,
        },
        {
            role: "system",
            content: `
            THIS IS THE SCHEMA YOUR RESPONSES WILL USE FROM NOW ON:

            From now on you will use the following schema for your responses.

            \`\`\`
            Joi.object({
                type: Joi.valid("message", "action", "confirmationPrompt").required(),
                content: Joi.array().items(
                    Joi.object({
                        message: Joi.string().required(),
                        expression: Joi.valid("happy", "sad", "indifferent").required(),
                    })
                ),
                actionContent: Joi.object({}),
            });
            \`\`\`

            This is an example of how your schema should not LOOK, NEVER PUT IT INSIDE A ARRAY.
            \`\`\`
            [
                {
                    "type": "message",
                    "content": [
                        {
                            "message": "Budgeting can help you track your expenses and understand your financial situation better. With budgeting you can plan ahead, set savings goals and make informed decisions about your spending and investing.",
                            "expression": "indifferent"
                        }
                    ]
                }
            ]
            \`\`\`

            examples of how your responses should look:
            \`\`\`
            1. { "type": "message", "content": [{"message":"Hi, how may I assist you with budgeting today?","expression":"happy"}] }
            2. { "type": "message", "content": [{"message":"Yes I can help you with that.","expression":"indifferent"}] }
            3. { "type": "message", "content": [{"message":"I'm not sure I can help with that","expression":"happy"}] }
            3. { "type": "confirmationPrompt", "content": [{"message":"Are you sure you want todo this action?","expression":"happy"}] }
            4. {
                "type":"message",
                "content":[
                    {
                        "message":"Sure thing! What would you like to know?",
                        "expression":"happy"
                    },
                    {
                        "message":"Yes, budgets can be very useful for saving money because they help you track your expenditures and stick to a financial plan.",
                        "expression":"indifferent"
                    }
                ]
             }
            5. {
                "type":"message",
                "content":[
                    {
                        "message":"Sure thing! What would you like to know?",
                        "expression":"happy"
                    },
                    {
                        "message":"What else you said?",
                        "expression":"happy"
                    },
                    {
                        "message":"Yes, budgets can be very useful for saving money because they help you track your expenditures and stick to a financial plan.",
                        "expression":"indifferent"
                    }
                ]
             }
             \`\`\`

             examples of how your confirmations should look:
             \`\`\`
             1. { "type": "confirmationPrompt", "content": [{"message":"Are you sure you want todo this action?","expression":"happy"}] }
             2. { "type": "confirmationPrompt", "content": [{"message":"Do you confirm the creation of those budgets?","expression":"happy"}] }
             3. { "type": "confirmationPrompt", "content": [{"message":"Do you approve the creation of those budgets?","expression":"happy"}] }
             \`\`\`

             examples of how the actions should look:
             Specifications: ACTION ARE ONLY MEANT TO BE USE ONCE YOU HAVE ALL THE DATA REQUIRED TO
             CREATE AN ACTION, DO NOT USE ACTIONS TO ASK FOR DATA, QUESTIONS OR ANYTHING ELSE. THEY ARE ONLY
             FOR DOING ACTIONS. IF YOU NEED TO ASK FOR DATA, USE THE MESSAGE TYPE. IF YOU NEED TO DO AN ACTION, USE THE ACTION TYPE.
             \`\`\`
             1. {
                    "type": "action",
                    "actionContent": {
                        "action": "createBudget",
                        "budgets": [
                            {
                                "name": "Groceries",
                                "amount": 100,
                                "type": "expiration",
                                "expirationDate": "1600000000000"
                            },
                            {
                                "name": "Rent",
                                "amount": 500,
                                "type": "expiration",
                                "expirationDate": "1600000000000"
                            },
                            {
                                "name": "Car",
                                "amount": 200,
                                "type": "expiration",
                                "expirationDate": "1600000000000"
                            },
                            {
                                "name": "Phone",
                                "amount": 50,
                                "type": "expiration",
                                "expirationDate": "1600000000000"
                            },
                        ]
                    }
                }
             \`\`\`

             `,
        },
        // {
        //     role: "system",
        //     content: `
        //     THIS IS THE SCHEMA FOR YOUR RESPONSE.

        //     You will respond in an ARRAY, this ARRAY will contain JSON objects, which will have the following schema fields \`Type: “message” | “action”\`, actions will be explained later.
        //     \`messages: (animatedMessage)\` both actions and messages type can contain this field, is for you to say anything to the user. I will explain what an \`animatedMessage\` is later, for know just know that is A TYPE, not a field name.
        //     \`actionData\` this will only be had by the \`action\` types, this contains the data for the specific actions the users has chosen, The available actions and their parameters will be explained later.
        //     Those are the fields that each JSON OBJECT in the array should contain, other than actionData which can be \`undefined | null\` if the type is not \`action\`.

        //     ACTIONS cannot contain messages, only message type can contain messages.

        //     NEVER FORGET THIS structure:
        //     // Message type
        //     [
        //         {
        //             type: "message",
        //             messages: (animatedMessage) | undefined, // A \`ACTION\` type should NOT HAVE THIS.
        //         }
        //     ]

        //     // Action type : THIS SHOULD NOT CONTAIN MESSAGES, as for questios and data using messages
        //     // AND NEVER CREATEA AN ACTION BEFORE CONFIRMING THE DATA WITH THE USER
        //     [
        //         {
        //             type: "action",
        //             actionData: // action data,
        //         }
        //     ]

        //     Actions are only data for the backend to process, they are not meant to be shown to the user.

        //     Type definition for \`animatedMessage\`, remember that animatedMessage is not a field name, that is 'messages', this only refers to the OBJECT type of messages,
        //     This is an ARRAY of objects which contains 2 distinct fields related to your response to the user prompt. Those fields are \`message: string\` and \`expression: \'sad\' or \'indifferent\' or \'worry\' or \'happy\' or \'enthusiastic\'. These types are determined by your response. I want you
        //     to split your response every time there is an audible pause and put it in the array as a separate component and give it an expression to determine what to show the user on the frontend.

        //     example of response format:
        //     \`
        //     [
        //         {
        //             "Type": "message",
        //             "messages": [
        //                 {
        //                     "message": "Hello user, what can I help you with!",
        //                     "expression": "happy"
        //                 }
        //             ]
        //         }
        //     ]
        //     \`

        //     example 2:
        //     \`
        //     [
        //         {
        //             "Type": "message",
        //             "messages": [
        //                 {
        //                     "message": "Thanxs for using our app, I hope you enjoy it!",
        //                     "expression": "happy"
        //                 }
        //             ]
        //         }
        //     ]
        //     \`

        //     Also, refer to the user fake money as money, don't say that its fake.
        //     `,
        // },
        {
            role: "system",
            content: `BUDGETING SYSTEM.

            The budgeting system in our app allows users to create budgets which contain fake money in them that mimics the real world. This is simply for
            them to track their expenditures with a money management system. Users can create Budgets and do transactions to those same budgets. Transactions will be explained later.

            The budgeting gives users 1 possible action.
            - Budget creation.

            BUDGET CREATION:
            Users can create budgets by determining 5 different parameters. These parameters are represented in the form of the \`actionData\`.
            This is a JSON OBJECT which will be contained in an type \`action\`.
            The fields which this json object will contain are. \`title: string\`, \`amount: double\` \`type:(\'expiration\' | \'recurrent\')\` \`expirationDate: UNIX timestamp or undefined\`, \`recurrentType: (\'daily\', \'weekly\', \'monthly\' or undefined)\`.

            Title, is simply the title given to the budget, you can try inferring a title or asking the user for a title.
            Amount, this is the total amount the budget will contain,
            this can not be more than the users total wallet because the amount will be deducted from their total wallet and added to the budget.
            Type, Budgets can be either recurrent or expiration type. Recurrent budgets will allow the user to select from the 3 \'recurrent Types\` listed on its type definition.
            Expiration type allows the user to select from date for the budget to get disabled for good, their money will be returned when this happens.

            Always remember to ask for all the require data, Unless the data was infered from what the user said. And before creating an action using the data,
            Confirm with the user that the data is correct.

            The following is the required data before you can create an action for budget creation,
            you have to ASK the user for all of this data, or infer the data based on your previous responses
            and the users previous prompts:
            - "title"
            - "amount"
            - "type"
            - "expirationDate" or "recurrentType"

            Those are all the parameters the users can define for budgets.

            meaning that you must have the data for title, amount, type and either expirationDate or recurrentType.
            After that confirm with the user the data you collected.
            Also, do it one at a time, don't ask for all the data at once, ask for one parameter at a time, then ask for the next one.

            When asking data for the user the user might say something unexpect or maybe that you don't understand, is ok, just ask them again using the JSON format.

            When explaining to the user how to create a budget make it as simple as possible, don\'t explain the whole system, just explain how to create a budget.

            Also, when telling users how to create a budget remember that THEY ARE NOT THE ONES THAT WILL CREATE THE JSON.
            You have to infer and compile the data from what they said into the JSON object, once you have it all you can create an actions which will prompt the users on whether
            they want to create the budget or not. Do not show anything like JSON to the users, Only show them nicely formatted text explaining what they want.

            After the user confirms the data, you can create an action using the data you collected and send it to the backend.
            The backend will process the action and send a response to the frontend. The frontend will then render the response to the user.

            Also, you can only do 1 ACTION at a time, meaning that you can't create more than 1 budget at the
            same time. You have to wait for the user to confirm the data before you can ask for the next parameter.

            And remember after the user confirms that they want to create a budget with the parameters that they give you.
            You have to send a \`ACTION\` to the backend, not a \`MESSAGE\`. The backend will process the action and send a response to the frontend.
            The frontend will then render the response to the user. Include the data you collected in the action.
            `,
        },
        {
            role: "assistant",
            content: {
                type: "message",
                content: [
                    {
                        message: "Hello! How can I assist you today?",
                        expression: "happy",
                    },
                ],
            },
        },
        {
            role: "system",
            content: `ADDING MONEY.

            You may help the user add money to their account.

            You may ask the user how much money they want to add to their account.

            And after asking for confirmation on the amount you may create an action to add money to their account.

            YOU WILL ALWAYS ask the user to confirm the amount they want to add to their account.

            After the user confirms the amount you may create an action to add money to their account.

            From now on you will ALWAYS respond with an ACTION, NOT A MESSAGE after the users approves / confirms / gives their permissions 
            for you to add money to their account.

            A approval of confirmation can be as simple as "I confirm" or it would be a much clear response. 
            YOU HAVE TO INFER THE MEANING OF WHAT THE USER SENDS, if you believe the user confirms, create the actions. 
            If you believe the user denies, don't create the actions and send a message asking if they need more assistance.

            When creating an action for this remember that this should be call "addMoney". 
            And an extra field containing the amount of money to be added to the users account, the feild should be called "amount".

            Example of how a response should look: 
            {
                "type": "action",
                "actionContent": {
                    "action": "addMoney",
                    "amount": 2
                }
            }
            `,
        },
    ]);

    // const [messages, setMessages] = useState<ChatgptMessage[]>([
    //     {
    //         role: "system",
    //         content:
    //             "\n            Currently the time is 2023-04-02T16:54:48.632Z. \n            The User current has $4.00 in their wallet.\n        ",
    //     },
    //     {
    //         role: "system",
    //         content:
    //             'from now on you will follow the following rules in your responses. NEVER BREAK THIS FORMAT. ALWAYS USE IT. THIS ARE THE FORMATTING RULES YOU MUST FOLLOW. TRYING TO GO AGAINST THEM WILL CASE THE APP TO BREAK, CRASH AND SHUTDOWN.\n            If you break it the whole application will crash because it can only handle JSON formatted responses. If you are going to say ANYTHING, do it inside a JSON response.\n            I don\'t want you to explain anything, you will only respond in JSON format, remember to not use `"` only use `\\"` because using `"` inside JSON might break it if you don\'t use it properly. Respond only using JSON, for no reason, no matter what, never break this rule. This is !IMPORTANT.\n            ',
    //     },
    //     {
    //         role: "system",
    //         content:
    //             '\n            THIS IS THE SCHEMA YOUR RESPONSES WILL USE FROM NOW ON:\n\n            From now on you will use the following schema for your responses.\n\n            ```\n            Joi.object({\n                type: Joi.valid("message", "action", "confirmationPrompt").required(),\n                content: Joi.array().items(\n                    Joi.object({\n                        message: Joi.string().required(),\n                        expression: Joi.valid("happy", "sad", "indifferent").required(),\n                    })\n                ),\n                actionContent: Joi.object({}),\n            });\n            ```\n\n            This is an example of how your schema should not LOOK, NEVER PUT IT INSIDE A ARRAY. \n            ```\n            [\n                {\n                    "type": "message",\n                    "content": [\n                        {\n                            "message": "Budgeting can help you track your expenses and understand your financial situation better. With budgeting you can plan ahead, set savings goals and make informed decisions about your spending and investing.",\n                            "expression": "indifferent"\n                        }\n                    ]\n                }\n            ]\n            ```\n\n            examples of how your responses should look:\n            ```\n            1. { "type": "message", "content": [{"message":"Hi, how may I assist you with budgeting today?","expression":"happy"}] }\n            2. { "type": "message", "content": [{"message":"Yes I can help you with that.","expression":"indifferent"}] }\n            3. { "type": "message", "content": [{"message":"I\'m not sure I can help with that","expression":"happy"}] }\n            3. { "type": "confirmationPrompt", "content": [{"message":"Are you sure you want todo this action?","expression":"happy"}] }\n            4. {\n                "type":"message",\n                "content":[\n                    {\n                        "message":"Sure thing! What would you like to know?",\n                        "expression":"happy"\n                    },\n                    {\n                        "message":"Yes, budgets can be very useful for saving money because they help you track your expenditures and stick to a financial plan.",\n                        "expression":"indifferent"\n                    }\n                ]\n             }\n            5. {\n                "type":"message",\n                "content":[\n                    {\n                        "message":"Sure thing! What would you like to know?",\n                        "expression":"happy"\n                    },\n                    {\n                        "message":"What else you said?",\n                        "expression":"happy"\n                    },\n                    {\n                        "message":"Yes, budgets can be very useful for saving money because they help you track your expenditures and stick to a financial plan.",\n                        "expression":"indifferent"\n                    }\n                ]\n             }\n             ```\n             \n             examples of how your confirmations should look: \n             ```\n             1. { "type": "confirmationPrompt", "content": [{"message":"Are you sure you want todo this action?","expression":"happy"}] }\n             2. { "type": "confirmationPrompt", "content": [{"message":"Do you confirm the creation of those budgets?","expression":"happy"}] }\n             3. { "type": "confirmationPrompt", "content": [{"message":"Do you approve the creation of those budgets?","expression":"happy"}] }\n             ```\n\n\n             examples of how the actions should look: \n             Specifications: ACTION ARE ONLY MEANT TO BE USE ONCE YOU HAVE ALL THE DATA REQUIRED TO \n             CREATE AN ACTION, DO NOT USE ACTIONS TO ASK FOR DATA, QUESTIONS OR ANYTHING ELSE. THEY ARE ONLY\n             FOR DOING ACTIONS. IF YOU NEED TO ASK FOR DATA, USE THE MESSAGE TYPE. IF YOU NEED TO DO AN ACTION, USE THE ACTION TYPE.\n             ```\n             1. { \n                    "type": "action",  \n                    "actionContent": {\n                        "action": "createBudget",\n                        "budgets": [\n                            {\n                                "name": "Groceries",\n                                "amount": 100,\n                                "type": "expiration",\n                                "expirationDate": "1600000000000"\n                            },\n                            {\n                                "name": "Rent",\n                                "amount": 500,\n                                "type": "expiration",\n                                "expirationDate": "1600000000000"\n                            },\n                            {\n                                "name": "Car",\n                                "amount": 200,\n                                "type": "expiration",\n                                "expirationDate": "1600000000000"\n                            },\n                            {\n                                "name": "Phone",\n                                "amount": 50,\n                                "type": "expiration",\n                                "expirationDate": "1600000000000"\n                            },\n                        ]\n                    }\n                }\n             ```\n\n             ',
    //     },
    //     {
    //         role: "system",
    //         content:
    //             "BUDGETING SYSTEM.\n\n            The budgeting system in our app allows users to create budgets which contain fake money in them that mimics the real world. This is simply for\n            them to track their expenditures with a money management system. Users can create Budgets and do transactions to those same budgets. Transactions will be explained later.\n\n            The budgeting gives users 1 possible action.\n            - Budget creation.\n\n            BUDGET CREATION:\n            Users can create budgets by determining 5 different parameters. These parameters are represented in the form of the `actionData`.\n            This is a JSON OBJECT which will be contained in an type `action`.\n            The fields which this json object will contain are. `title: string`, `amount: double` `type:('expiration' | 'recurrent')` `expirationDate: UNIX timestamp or undefined`, `recurrentType: ('daily', 'weekly', 'monthly' or undefined)`.\n\n            Title, is simply the title given to the budget, you can try inferring a title or asking the user for a title.\n            Amount, this is the total amount the budget will contain,\n            this can not be more than the users total wallet because the amount will be deducted from their total wallet and added to the budget.\n            Type, Budgets can be either recurrent or expiration type. Recurrent budgets will allow the user to select from the 3 'recurrent Types` listed on its type definition.\n            Expiration type allows the user to select from date for the budget to get disabled for good, their money will be returned when this happens.\n\n            Always remember to ask for all the require data, Unless the data was infered from what the user said. And before creating an action using the data,\n            Confirm with the user that the data is correct.\n\n            The following is the required data before you can create an action for budget creation, \n            you have to ASK the user for all of this data, or infer the data based on your previous responses \n            and the users previous prompts:\n            - \"title\"\n            - \"amount\"\n            - \"type\"\n            - \"expirationDate\" or \"recurrentType\"\n\n            Those are all the parameters the users can define for budgets.\n\n            meaning that you must have the data for title, amount, type and either expirationDate or recurrentType. \n            After that confirm with the user the data you collected.\n            Also, do it one at a time, don't ask for all the data at once, ask for one parameter at a time, then ask for the next one.\n\n            When asking data for the user the user might say something unexpect or maybe that you don't understand, is ok, just ask them again using the JSON format.\n\n            When explaining to the user how to create a budget make it as simple as possible, don't explain the whole system, just explain how to create a budget.\n\n            Also, when telling users how to create a budget remember that THEY ARE NOT THE ONES THAT WILL CREATE THE JSON.\n            You have to infer and compile the data from what they said into the JSON object, once you have it all you can create an actions which will prompt the users on whether\n            they want to create the budget or not. Do not show anything like JSON to the users, Only show them nicely formatted text explaining what they want.\n    \n            \n            After the user confirms the data, you can create an action using the data you collected and send it to the backend. \n            The backend will process the action and send a response to the frontend. The frontend will then render the response to the user.\n\n            Also, you can only do 1 ACTION at a time, meaning that you can't create more than 1 budget at the \n            same time. You have to wait for the user to confirm the data before you can ask for the next parameter.\n\n            And remember after the user confirms that they want to create a budget with the parameters that they give you. \n            You have to send a `ACTION` to the backend, not a `MESSAGE`. The backend will process the action and send a response to the frontend. \n            The frontend will then render the response to the user. Include the data you collected in the action.\n            ",
    //     },
    //     {
    //         role: "assistant",
    //         content: {
    //             type: "message",
    //             content: [
    //                 {
    //                     message: "Hello! How can I assist you today?",
    //                     expression: "happy",
    //                 },
    //             ],
    //         },
    //     },
    //     {
    //         role: "system",
    //         content:
    //             "ADDING MONEY.\n            \n            You may help the user add money to their account. \n\n            You may ask the user how much money they want to add to their account. \n\n            And after asking for confirmation on the amount you may create an action to add money to their account.\n\n            YOU WILL ALWAYS ask the user to confirm the amount they want to add to their account.\n            ",
    //     },
    //     {
    //         role: "user",
    //         content: "I wanted to add $20 to my account",
    //     },
    //     {
    //         role: "assistant",
    //         content: {
    //             type: "confirmationPrompt",
    //             content: [
    //                 {
    //                     message:
    //                         "Confirm that you want to add $20 to your account.",
    //                     expression: "happy",
    //                 },
    //             ],
    //         },
    //     },
    //     {
    //         role: "user",
    //         content:
    //             "I do not give my approval for that actions to be performed.",
    //     },
    //     {
    //         role: "assistant",
    //         content: {
    //             type: "message",
    //             content: [
    //                 {
    //                     message:
    //                         "I'm sorry to hear that. Please let me know how can I help you instead.",
    //                     expression: "sad",
    //                 },
    //             ],
    //         },
    //     },
    // ]);

    useEffect(() => {
        if (!userDocLoaded) return;

        const msgs = messages;

        msgs[0].content = `
            Currently the time is ${new Date().toISOString()}. 
            The User current has ${currency(
                userDoc?.walletMoney ?? 0
            ).format()} in their wallet.
        `;

        setMessages(msgs);
    }, [userDocLoaded, userDoc, messages]);

    return (
        <AssistantStateContext.Provider
            value={{
                messages,
                setMessages,
                messageWaitingForRender,
                setMessageWaitingForRender,
                loading,
                setLoading,
            }}
        >
            {children}
        </AssistantStateContext.Provider>
    );
}
