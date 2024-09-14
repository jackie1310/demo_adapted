import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const openai = new OpenAI();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const instructionMessage: ChatCompletionAssistantMessageParam = {
//     role: "assistant",
//     content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
// }

export async function POST(req: Request) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {request_message} = body;
        // console.log(messages_arr);

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!genAI.apiKey) {
            return new NextResponse("OpenAI API Key not configured", {status: 500});
        }

        if (!request_message) {
            return new NextResponse("Message are required", {status: 400});
        }

        // const response = await openai.chat.completions.create({
        //     messages: [instructionMessage, ...request_messages],
        //     model: "gpt-3.5-turbo",
        // });

        // const bot_response = response.choices[0]?.message.content;
        const assistant = "You are a code generator. Your code must be written only in markdown code snippets. Generate code explanations also."
        const result = await model.generateContent(`${assistant} ${request_message}`);
        const response = result.response.text();
        const bot_response = response.replaceAll(/\*/g, "");

        return NextResponse.json({message: bot_response});

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}