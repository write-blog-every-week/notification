export interface BlogCount {
  userId: string;
  requireCount: number;
}

export interface BlogUrl {
  userName: string;
  feedUrl: string;
}

export type MemberData = BlogCount & BlogUrl;

export type ParseResult = {
  feedUrl: string;
  userId: string;
  userName: string;
};
