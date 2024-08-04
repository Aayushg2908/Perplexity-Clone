import { OpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import {
  RunnableSequence,
  RunnableMap,
  RunnableLambda,
} from "@langchain/core/runnables";
import formatChatHistoryAsString from "../utils/formatHistory";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { searchSearxng } from "../core/searxng";

const llm = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const VideoSearchChainPrompt = `
You will be given a conversation below and a follow up question. You need to rephrase the follow-up question so it is a standalone question that can be used by the LLM to search Youtube for videos.
  You need to make sure the rephrased question agrees with the conversation and is relevant to the conversation.
  
  Example:
  1. Follow up question: How does a car work?
  Rephrased: How does a car work?
  
  2. Follow up question: What is the theory of relativity?
  Rephrased: What is theory of relativity
  
  3. Follow up question: How does an AC work?
  Rephrased: How does an AC work
  
  Conversation:
  {chat_history}
  
  Follow up question: {query}
  Rephrased question:
`;

interface VideoSearchChainInput {
  chat_history: BaseMessage[];
  query: string;
}

const strParser = new StringOutputParser();

const videoSearchChain = RunnableSequence.from([
  RunnableMap.from({
    chat_history: (input: VideoSearchChainInput) => {
      return formatChatHistoryAsString(input.chat_history);
    },
    query: (input: VideoSearchChainInput) => {
      return input.query;
    },
  }),
  PromptTemplate.fromTemplate(VideoSearchChainPrompt),
  llm,
  strParser,
  RunnableLambda.from(async (input: string) => {
    const res = await searchSearxng(input, {
      engines: ["youtube"],
    });

    const videos = [];

    res.results.forEach((result) => {
      if (result.thumbnail && result.url && result.title && result.iframe_src) {
        videos.push({
          img_src: result.thumbnail,
          url: result.url,
          title: result.title,
          iframe_src: result.iframe_src,
        });
      }
    });

    return videos.slice(0, 10);
  }),
]);

export default videoSearchChain;
