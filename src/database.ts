import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import humps from "humps";
import { MemberData } from "./type";

const TABLE_NAME = process.env.DYNAMO_DB_TABLE_NAME ?? "";

/**
 * メンバー全員の情報を取得する
 */
export const findMembers = async (): Promise<MemberData[]> => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  const result = await client.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    }),
  );

  return <MemberData[]>humps.camelizeKeys(result.Items);
};

/**
 * 単体メンバーの情報を取得する
 * @param userId
 */
export const findMember = async (userId: string): Promise<MemberData | null> => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  const result = await client.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        user_id: { S: userId },
      },
    }),
  );

  return result.Item ? <MemberData>humps.camelizeKeys(result.Item) : null;
};

/**
 * ブログの必要記事数をリフレッシュする
 * @param userId
 * @param count
 */
export const refreshRequireCount = async (userId: string, count: number): Promise<void> => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { user_id: userId },
      UpdateExpression: "set require_count = :require_count",
      ExpressionAttributeValues: {
        ":require_count": count,
      },
    }),
  );
};

/**
 * 新しいユーザーを追加する
 * @param memberData
 */
export const createMember = async (memberData: MemberData): Promise<void> => {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });

  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { ...humps.decamelizeKeys(memberData) },
    }),
  );
};
