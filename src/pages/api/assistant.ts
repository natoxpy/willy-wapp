import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { db } from "@/firebase/firebase.config";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function ChatAssistant(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("received request");

    if (req.method !== "POST")
        return res.status(405).send("Method not allowed");

    if (!req.body.messages) return res.status(400).send("Bad request");

    console.log(
        "last message",
        JSON.stringify(req.body.messages[req.body.messages.length - 1], null, 4)
    );

    try {
        const completion = await openai.createChatCompletion({
            // You need early access to GPT-4, otherwise use "gpt-3.5-turbo"
            model: "gpt-3.5-turbo",
            messages: req.body.messages,
            // messages: [
            //     { role: "system", content: "You are a helpful assistant." },
            // ],
        });

        const usageDocRef = doc(db, "openai_usage", "eXsxhfeKhX9O54anlvtZ");
        const docSnap = await getDoc(usageDocRef);
        const data = docSnap.data() as any;

        updateDoc(usageDocRef, {
            total_tokens:
                data.total_tokens + completion.data.usage?.total_tokens,
            requests: data.requests + 1,
            last_request_total: completion.data.usage?.total_tokens,
        });

        res.status(200).json({
            result: completion.data.choices[0].message,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }

    console.log("request finished");
}
