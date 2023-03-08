import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ChatGPTDefinition } from "../functions/chat_gpt.ts";

export const SendMessageToChatGPT_Workflow = DefineWorkflow({
  callback_id: "send_message_to_chatGPT",
  title: "Send Message to ChatGPT",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const inputForm = SendMessageToChatGPT_Workflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Send prompt to ChatGPT",
    interactivity: SendMessageToChatGPT_Workflow.inputs.interactivity,
    submit_label: "Send prompt",
    fields: {
      elements: [{
        name: "channel",
        title: "Channel to send response to",
        type: Schema.slack.types.channel_id,
        default: SendMessageToChatGPT_Workflow.inputs.channel,
      }, {
        name: "prompt",
        title: "Prompt",
        type: Schema.types.string,
        long: true,
      }],
      required: ["channel", "prompt"],
    },
  },
);

const chatGPTStep = SendMessageToChatGPT_Workflow.addStep(ChatGPTDefinition, {
  prompt: inputForm.outputs.fields.prompt,
});

SendMessageToChatGPT_Workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: inputForm.outputs.fields.channel,
  message: "Received from chatGPT: ```" +
    JSON.stringify(chatGPTStep.outputs.response, null, 2) +
    "```",
});

export default SendMessageToChatGPT_Workflow;
