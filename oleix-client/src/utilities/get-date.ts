import { format, formatDistanceToNow, isDate, isSameDay, isYesterday, toDate } from 'date-fns';

export const getDate = (from: string | undefined): string => {
  if (!from) {
    return '—';
  }
  const date = new Date(from);

  if (!isDate(date)) {
    return 'Empty';
  }
  const today = toDate(new Date());

  if (isSameDay(today, date) || isYesterday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, 'dd.MM.yyyy');
};
