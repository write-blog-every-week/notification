import { DateTime } from "luxon";
import { getLastWeekMonday, getThisWeekMonday } from "../date";

test("1通目の水曜日には今週月曜日の0時がとれる", () => {
  const now = DateTime.fromFormat("2023-10-04 15:00:00", "yyyy-MM-dd HH:00:00");
  const actual = getThisWeekMonday(now);
  expect(actual.toFormat("yyyy-MM-dd HH:00:00")).toBe("2023-10-02 00:00:00");
});

test("2通目の金曜日には今週月曜日の0時がとれる", () => {
  const now = DateTime.fromFormat("2023-10-06 15:00:00", "yyyy-MM-dd HH:00:00");
  const actual = getThisWeekMonday(now);
  expect(actual.toFormat("yyyy-MM-dd HH:00:00")).toBe("2023-10-02 00:00:00");
});

test("3通目の日曜日には今週月曜日の0時がとれる", () => {
  const now = DateTime.fromFormat("2023-10-08 15:00:00", "yyyy-MM-dd HH:00:00");
  const actual = getThisWeekMonday(now);
  expect(actual.toFormat("yyyy-MM-dd HH:00:00")).toBe("2023-10-02 00:00:00");
});

test("月曜日の0時に実行した場合は先週の月曜の0時がとれる", () => {
  const now = DateTime.fromFormat("2023-10-09 00:00:00", "yyyy-MM-dd HH:00:00");
  const actual = getLastWeekMonday(now);
  expect(actual.toFormat("yyyy-MM-dd HH:00:00")).toBe("2023-10-02 00:00:00");
});
