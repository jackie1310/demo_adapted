"use client";

import Heading from "@/components/heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../../../../components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionAssistantMessageParam, ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown"

export default function CodePage() {
    const router = useRouter();
    const [messages, setMessages] = useState<(ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: ChatCompletionUserMessageParam = {
                role: "user",
                content: values.prompt
            };

            // Add the user's message to the state
            const newMessages = [...messages, userMessage];

            // Call the API with the messages
            const response = await axios.post("/api/code", {
                request_message: values.prompt
            });

            // Extract the assistant's response from the API response
            const assistantMessage: ChatCompletionAssistantMessageParam = {
                role: "assistant",
                content: response.data.message // Assuming API returns { message: { content: "..."} }
            };

            // Update the state with both user and assistant messages
            setMessages((current) => [...current, userMessage, assistantMessage]);

            // Reset the form
            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Code Generator"
                description="Generate code using descriptive text."
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-green-700/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Simple toggle button using react hooks."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {(messages.length == 0 && !isLoading) && (
                        <Empty label="No conversation found" />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                    components={{
                                        pre: ({ node, ...props }) => (
                                            <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                                <pre {...props}/>
                                            </div>
                                        ), 

                                        code: ({ node, ...props}) => (
                                            <code className="bg-black/10 rounded-lg p-1" {...props}/>
                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                >
                                    {message.content as string || ""}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
