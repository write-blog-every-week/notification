import { DateTime } from "luxon";

/**
 * 今週の月曜の日付を取得する
 * @param date
 */
export const getThisWeekMonday = (date = DateTime.now()) => {
  return date.setZone("Asia/Tokyo").setLocale("ja").startOf("week").startOf("day");
};

/**
 * 先週の月曜の日付を取得する
 * @param date
 */
export const getLastWeekMonday = (date = DateTime.now()) => {
  return date.setZone("Asia/Tokyo").setLocale("ja").minus({ hours: 1 }).startOf("week").startOf("day");
};
