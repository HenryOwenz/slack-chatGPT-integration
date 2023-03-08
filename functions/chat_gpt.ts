import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ChatGPTDefinition = DefineFunction({
  callback_id: "chatgpt_v1",
  title: "Chat with chatGPT",
  source_file: "functions/chat_gpt.ts",
  //input_parameters: { properties: {}, required: [] },
  input_parameters: {
    properties: {
      prompt: { type: Schema.types.string },
    },
    required: ["prompt"],
  },
  output_parameters: {
    properties: {
      response: { type: Schema.types.string },
    },
    required: ["response"],
  },
});

export default SlackFunction(
  ChatGPTDefinition,
  async ({ inputs, env }) => {
    const prompt = inputs.prompt;
    // enter your OpenAI API key here
    const apiKey = "";

    const endpoint = `https://api.openai.com/v1/chat/completions`;

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };

    const requestBody = {
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": prompt }],
      max_tokens: 2000,
      n: 5,
      temperature: 0.5,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (response.status != 200) {
        const body = await response.text();
        const error =
          `Failed to call OpenAI API (status: ${response.status}, body: ${body})`;
        return { error };
      }

      const json = await response.json();
      const responseText = JSON.stringify(json.choices[0].text);

      return { outputs: { response: responseText } };
    } catch (err) {
      const error = `Failed to call OpenAI API due to ${err}`;
      return { error };
    }
  },
);
