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

const imageSearchChainPrompt = `
You will be given a conversation below and a follow up question. You need to rephrase the follow-up question so it is a standalone question that can be used by the LLM to search the web for images.
You need to make sure the rephrased question agrees with the conversation and is relevant to the conversation.
Example:
1. Follow up question: What is a cat?
Rephrased: A cat
2. Follow up question: What is a car? How does it works?
Rephrased: Car working
3. Follow up question: How does an AC work?
Rephrased: AC working
Conversation:
{chat_history}
Follow up question: {query}
Rephrased question:
`;

interface ImageSearchChainInput {
  chat_history: BaseMessage[];
  query: string;
}

const strParser = new StringOutputParser();

const imageSearchChain = RunnableSequence.from([
  RunnableMap.from({
    chat_history: (input: ImageSearchChainInput) => {
      return formatChatHistoryAsString(input.chat_history);
    },
    query: (input: ImageSearchChainInput) => {
      return input.query;
    },
  }),
  PromptTemplate.fromTemplate(imageSearchChainPrompt),
  llm,
  strParser,
  RunnableLambda.from(async (input: string) => {
    const res = await searchSearxng(input, {
      categories: ["images"],
      engines: ["bing_images", "google_images"],
    });

    const images = [];

    res.results.forEach((result) => {
      if (result.img_src && result.url && result.title) {
        images.push({
          img_src: result.img_src,
          url: result.url,
          title: result.title,
        });
      }
    });

    return images.slice(0, 10);
  }),
]);

export default imageSearchChain;
