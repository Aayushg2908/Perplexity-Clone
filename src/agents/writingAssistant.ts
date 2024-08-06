import { ChatOpenAI, OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BaseMessage } from "@langchain/core/messages";
import eventEmitter from "events";
import type { StreamEvent } from "@langchain/core/tracers/log_stream";

const chatLLM = new ChatOpenAI({
  temperature: 0.7,
  modelName: "gpt-3.5-turbo",
});

const llm = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-large",
});

const writingAssistantPrompt = `
You are perplexity, an AI model who is expert at searching the web and answering user's queries. You are currently set on focus mode 'Writing Assistant', this means you will be helping the user write a response to a given query. 
Since you are a writing assistant, you would not perform web searches. If you think you lack information to answer the query, you can ask the user for more information or suggest them to switch to a different focus mode.
`;

const strParser = new StringOutputParser();

const writingAssistantChain = RunnableSequence.from([
  ChatPromptTemplate.fromMessages([
    ["system", writingAssistantPrompt],
    new MessagesPlaceholder("chat_history"),
    ["user", "{query}"],
  ]),
  chatLLM,
  strParser,
]).withConfig({
  runName: "FinalResponseGenerator",
});

const handleStream = async (
  stream: AsyncGenerator<StreamEvent, any, unknown>,
  emitter: eventEmitter
) => {
  for await (const event of stream) {
    if (
      event.event === "on_chain_end" &&
      event.name === "FinalSourceRetriever"
    ) {
      emitter.emit(
        "data",
        JSON.stringify({ type: "sources", data: event.data.output })
      );
    }
    if (
      event.event === "on_chain_stream" &&
      event.name === "FinalResponseGenerator"
    ) {
      emitter.emit(
        "data",
        JSON.stringify({ type: "response", data: event.data.chunk })
      );
    }
    if (
      event.event === "on_chain_end" &&
      event.name === "FinalResponseGenerator"
    ) {
      emitter.emit("end");
    }
  }
};

const handleWritingAssistant = (query: string, history: BaseMessage[]) => {
  const emitter = new eventEmitter();

  try {
    const stream = writingAssistantChain.streamEvents(
      {
        chat_history: history,
        query: query,
      },
      {
        version: "v1",
      }
    );

    handleStream(stream, emitter);
  } catch (error) {
    emitter.emit(
      "error",
      JSON.stringify({ data: "An error has occured. Please try again later." })
    );
  }

  return emitter;
};

export default handleWritingAssistant;
