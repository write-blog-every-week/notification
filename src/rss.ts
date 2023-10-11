import { DateTime } from "luxon";
import Parser, { Item } from "rss-parser";
import { BlogCount, MemberData } from "./type";

const parser = new Parser();

/**
 *
 * ブログを書いていないユーザーを取得する
 * @param users
 * @param targetMonday
 */
export const fetchTargetUserList = async (users: MemberData[], targetMonday: DateTime): Promise<BlogCount[]> => {
  const result: BlogCount[] = [];
  for (let user of users) {
    const output = await parse(user.feedUrl);
    result.push({
      userId: user.userId,
      requireCount: calcRequireCount(user.requireCount, targetMonday, output),
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

/**
 * 必要記事数を計算する
 * @param requireCount
 * @param targetMonday
 * @param output
 */
const calcRequireCount = (requireCount: number, targetMonday: DateTime, output: Parser.Output<Item>) => {
  let result = 0;
  for (let i = 0; i < requireCount; i++) {
    const latestPublishedDate = getLatestFeedPubDate(output, i, targetMonday);
    if (targetMonday > latestPublishedDate) {
      // 対象の月曜日以前の日付の場合は今週書いていないのでカウントが増える
      result++;
    }
  }

  return result;
};

/**
 * 最新フィードの公開日を取得する
 */
const getLatestFeedPubDate = (output: Parser.Output<Item>, requireCount: number, targetMonday: DateTime) => {
  if (!output.items || output.items.length < requireCount + 1) {
    // そもそも記事数が足りない場合は公開日を取得できないのでlatestは、必ず通知対象となる今週の月曜日と合わせる
    return targetMonday;
  }

  const pubDate = output.items[requireCount].pubDate;
  if (!pubDate) {
    return targetMonday;
  }

  let formatDateTime = DateTime.fromRFC2822(pubDate, {
    zone: 'Asia/Tokyo',
    locale: 'ja'
  })

  if (!formatDateTime.isValid) {
    // pubDateのフォーマットによってはDateTimeに変換できない可能性があるので2段階でformatする
    formatDateTime = DateTime.fromISO(pubDate, {
      zone: 'Asia/Tokyo',
      locale: 'ja'
    })
  }

  return formatDateTime;
};
