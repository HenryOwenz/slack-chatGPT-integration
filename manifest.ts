import { Manifest } from "deno-slack-sdk/mod.ts";
import SendMessageToChatGPT_Workflow from "./workflows/send_message_to_chatGPT.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "chatGPT-integration",
  description: "A template for building Slack apps with Deno",
  icon: "assets/default_new_app_icon.png",
  workflows: [SendMessageToChatGPT_Workflow],
  outgoingDomains: [
    "api.openai.com",
  ],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
