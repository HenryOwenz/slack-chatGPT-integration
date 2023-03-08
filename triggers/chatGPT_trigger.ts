import { Trigger } from "deno-slack-api/types.ts";
import { SendMessageToChatGPT_Workflow } from "../workflows/send_message_to_chatGPT.ts";

const trigger: Trigger<typeof SendMessageToChatGPT_Workflow.definition> = {
  type: "shortcut",
  name: "Send Message to ChatGPT",
  description: "Starts the workflow to send a message to ChatGPT",
  workflow: "#/workflows/send_message_to_chatGPT",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default trigger;
