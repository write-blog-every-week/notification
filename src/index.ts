import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { createMember, findMember, findMembers, refreshRequireCount } from "./database";
import { getLastWeekMonday, getThisWeekMonday } from "./date";
import { makeReminderSendText, makeResultSendText } from "./message";
import { parseParams } from "./query";
import { fetchTargetUserList } from "./rss";
import { send } from "./slack";
import { MemberData } from "./type";

export const blogRemindHandler = async (): Promise<any> => {
  let statusCode = 200;
  let message = "Send Complete.";

  try {
    const targetMonday = getThisWeekMonday();
    const members = await findMembers();
    const targetMembers = await fetchTargetUserList(members, targetMonday);
    await send(makeReminderSendText(targetMembers.filter((member) => member.requireCount >= 1)));
  } catch (err: unknown) {
    statusCode = 500;
    message = err instanceof Error ? err.message : "some error happened";
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify({ message }),
  };
};

export const blogResultHandler = async (): Promise<any> => {
  let statusCode = 200;
  let message = "Send Complete.";

  try {
    const targetMonday = getLastWeekMonday();
    const members = await findMembers();
    const targetMembers = await fetchTargetUserList(members, targetMonday);

    targetMembers.map((member) => {
      // 必要記事数を増やしてデータ保存(0の人は1になり、1以上の人は1記事増える)
      refreshRequireCount(member.userId, member.requireCount++);
    });

    await send(makeResultSendText(targetMembers));
  } catch (err: unknown) {
    statusCode = 500;
    message = err instanceof Error ? err.message : "some error happened";
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify({ message }),
  };
};

export const blogRegisterHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (event.body === null) {
      throw new Error("パラメータがありません。");
    }

    const params = parseParams(event.body);
    if (params.userId === null) {
      throw new Error("パラメータが取得できませんでした。");
    }

    const member = await findMember(params.userId);
    if (member) {
      throw new Error("あなたのブログはすでに登録済みです。");
    }

    await createMember(<MemberData>{
      userId: params.userId,
      userName: params.userName,
      feedUrl: params.feedUrl,
      requireCount: 1,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: "ブログを登録しました！これから頑張りましょう！",
      }),
    };
  } catch (err: unknown) {
    return {
      statusCode: 200, // Slackへの通知のため200にする
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response_type: "ephemeral",
        text: err instanceof Error ? err.message : "不明なエラー",
      }),
    };
  }
};
