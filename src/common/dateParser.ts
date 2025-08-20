import { parse, isValid, format } from 'date-fns';

export function normalizeDate(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  const knownFormats = [
    'dd/MM/yyyy',           // e.g. "11/11/2000"
    'yyyy-MM-dd HH:mm:ss',  // e.g. "1979-03-09 00:00:00"
    'yyyy-MM-dd',           // e.g. "1979-03-09"
    'MM/dd/yyyy',           // fallback if API sends US style
    'dd-MM-yyyy',           // e.g. "11-11-2000"
    'yyyy/MM/dd',           // e.g. "2000/11/11"
  ];

  let parsedDate: any = null;

  for (const fmt of knownFormats) {
    const parsed = parse(input.trim(), fmt, new Date());
    if (isValid(parsed)) {
      parsedDate = parsed;
      break;
    }
  }

  if (!parsedDate) {
    return null;
  }

  return format(parsedDate, 'yyyy-MM-dd');
}
