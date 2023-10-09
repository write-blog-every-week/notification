import { BlogCount } from "./type";

const MAX_BLOG_QUOTA = Number(process.env.MAX_BLOG_QUOTA);

export const makeReminderSendText = (users: BlogCount[]) => {
  switch (users.length) {
    case 0:
      return `
今週はすでに全員がブログを書いています！ :tada:
やったね！！！
`;
    default:
      return `
まだブログを書けていないユーザーがいます！
書けていないユーザー: ${users.length}人
================
${getReminderReplaceMessageList(users)}`;
  }
};

export const makeResultSendText = (users: BlogCount[]) => {
  return `
<!channel>
1週間お疲れ様でした！
今週も頑張ってブログを書きましょう！
先週ブログを書けていない人は今週書くブログ記事が増えていることを確認してください！
================
${getReminderReplaceMessageList(users.filter((u) => u.requireCount <= MAX_BLOG_QUOTA))}================

${getCancelReplaceMessageList(users.filter((u) => u.requireCount > MAX_BLOG_QUOTA))}
`;
};

const getReminderReplaceMessageList = (users: BlogCount[]) => {
  let list = "";
  users.forEach((user) => {
    list += `<@${user.userId}>さん\t残り${user.requireCount}記事\n`;
  });
  return list;
};

const getCancelReplaceMessageList = (users: BlogCount[]) => {
  return users.length === 0
    ? "今週は退会対象者はいません！ :tada:"
    : `残念ながら以下の方は退会となります :cry:
================
${getReminderReplaceMessageList(users)}================`;
};
