import { isAfter, isEqual } from "date-fns";
import Parser, { Item } from "rss-parser";
import { BlogCount, MemberData } from "./type";

const parser = new Parser();

/**
 *
 * ブログを書いていないユーザーを取得する
 * @param users
 * @param targetMonday
 * @returns カウントがマイナスのユーザーはブログフィードを取得できなかったエラーデータ
 */
export const fetchTargetUserList = async (users: MemberData[], targetMonday: Date): Promise<BlogCount[]> => {
  const result: BlogCount[] = [];
  for (let user of users) {
    let requiredCount = -1;
    const output = await parse(user.feedUrl);
    requiredCount = calcRequiredCount(user.requireCount, targetMonday, output);

    result.push({
      userId: user.userId,
      requireCount: requiredCount,
    });
  }
  return result;
};

const parse = async (feedUrlOrXml: string) => {
  if (!feedUrlOrXml.startsWith("http")) {
    // for testing purpose
    return await parser.parseString(feedUrlOrXml);
  }
  return await parser.parseURL(feedUrlOrXml);
};

const calcRequiredCount = (requiredCount: number, targetMonday: Date, output: Parser.Output<Item>) => {
  let result = 0;
  for (let i = 0; i < requiredCount; i++) {
    const latestPublishedDate = getLatestFeedPubDate(output, i, targetMonday);
    if (isEqual(targetMonday, latestPublishedDate) || isAfter(targetMonday, latestPublishedDate)) {
      result++;
    }
  }

  return result;
};

/**
 * 最新フィードの公開日を取得する
 */
const getLatestFeedPubDate = (output: Parser.Output<Item>, requiredCount: number, targetMonday: Date) => {
  if (!output.items || output.items.length < requiredCount + 1) {
    // そもそも記事数が足りない場合は公開日を取得できないのでlatestは、必ず通知対象となる今週の月曜日と合わせる
    return targetMonday;
  }
  const pubDate = output.items[requiredCount].pubDate;
  if (!pubDate) {
    return targetMonday;
  }
  return new Date(pubDate);
};
