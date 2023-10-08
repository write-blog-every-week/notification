import { parse } from "querystring";
import { ParseResult } from "./type";

const SLACK_TOKEN = process.env.SLACK_TOKEN ?? "";

export const parseParams = (query: string): ParseResult => {
  const q = parse(query);
  if (q.token !== SLACK_TOKEN) {
    throw new Error("トークンが一致しません");
  }

  if (Array.isArray(q.text)) {
    q.text = q.text[0];
  }
  if (Array.isArray(q.user_id)) {
    q.user_id = q.user_id[0];
  }
  if (Array.isArray(q.user_name)) {
    q.user_name = q.user_name[0];
  }

  return {
    feedUrl: q.text ?? "",
    userId: q.user_id ?? "",
    userName: q.user_name ?? "",
  };
};
