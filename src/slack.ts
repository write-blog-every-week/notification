import axios from "axios";

const API_URL = process.env.SLACK_API_URL ?? "";
const SLACK_CHANNEL = process.env.SLACK_CHANNEL_NAME ?? "";

export const send = async (text: string) => {
  const data = textToData(text);
  await axios.post(API_URL, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const textToData = (text: string) => {
  return {
    text: text,
    channel: SLACK_CHANNEL,
    link_names: 1,
  };
};
