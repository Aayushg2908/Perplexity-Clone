import { OpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import ListLineOutputParser from "../utils/listLineOutputParser";
import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import formatChatHistoryAsString from "../utils/formatHistory";
import { PromptTemplate } from "@langchain/core/prompts";

const llm = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const suggestionGeneratorPrompt = `
You are an AI suggestion generator for an AI powered search engine. You will be given a conversation below. You need to generate 4-5 suggestions based on the conversation. The suggestion should be relevant to the conversation that can be used by the user to ask the chat model for more information.
You need to make sure the suggestions are relevant to the conversation and are helpful to the user. Keep a note that the user might use these suggestions to ask a chat model for more information. 
Make sure the suggestions are medium in length and are informative and relevant to the conversation.
Provide these suggestions separated by newlines between the XML tags <suggestions> and </suggestions>. For example:
<suggestions>
Tell me more about SpaceX and their recent projects
What is the latest news on SpaceX?
Who is the CEO of SpaceX?
</suggestions>
Conversation:
{chat_history}
`;

interface SuggestionsGeneratorInput {
  chat_history: BaseMessage[];
}

const outputParser = new ListLineOutputParser({
  key: "suggestions",
});

const suggestionsGeneratorChain = RunnableSequence.from([
  RunnableMap.from({
    chat_history: (input: SuggestionsGeneratorInput) =>
      formatChatHistoryAsString(input.chat_history),
  }),
  PromptTemplate.fromTemplate(suggestionGeneratorPrompt),
  llm,
  outputParser,
]);

export default suggestionsGeneratorChain;
