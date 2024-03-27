import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, SUPER_ROLE, CATEGORY_TEXT_CHANNEL_NAME,CATEGORY_VOICE_CHANNEL_NAME} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  SUPER_ROLE,
  CATEGORY_TEXT_CHANNEL_NAME,
  CATEGORY_VOICE_CHANNEL_NAME
};
