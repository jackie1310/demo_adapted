import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();
        // const {request_messages} = body;
        const { request_message } = body;
        // console.log(messages_arr);

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!genAI.apiKey) {
            return new NextResponse("Gemini API Key not configured", { status: 500 });
        }

        if (!request_message) {
            return new NextResponse("Message are required", { status: 400 });
        }

        // const response = await openai.chat.completions.create({
        //     messages: request_messages,
        //     model: "gpt-3.5-turbo",
        // });

        // const bot_response = response.choices[0]?.message.content;
        const result = await model.generateContent(request_message);
        const response = result.response.text();
        const bot_response = response.replaceAll(/\*/g, "");

        return NextResponse.json({ message: bot_response });

    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}