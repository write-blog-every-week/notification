import { previousMonday } from "date-fns";

/**
 * 前の月曜の日付を取得する
 * @param date
 */
export const getPreviousMonday = (date = new Date()) => previousMonday(date);
