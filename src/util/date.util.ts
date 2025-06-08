export function formatDateToPtBr(date: Date): string {
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = date.getUTCFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function formatFullDatePtBr(
  date: Date,
  includeDay: boolean = true
): string {
  const localDate = new Date(date.getTime());

  const day = localDate.getUTCDate();
  const month = localDate.getUTCMonth();
  const year = localDate.getUTCFullYear();

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  return `${includeDay ? day + " de" : ""} ${monthNames[month]} de ${year}`;
}

export function combineIsoDateAndTime(dateStr: string, timeStr: string): Date {
  const date = new Date(dateStr);
  const [hours, minutes] = timeStr.split(":").map(Number);

  const combined = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hours,
    minutes
  );

  return combined;
}

export function getStringDateDifference(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;

  switch (diffDays) {
    case 0:
      return "Hoje";
    case 1:
      return "Amanhã";
    case -1:
      return "Ontem";
    default:
      return diffDays > 0
        ? `em ${diffDays} dias`
        : `há ${Math.abs(diffDays)} dias`;
  }
}

export function getDateDifference(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return Math.abs(diffDays);
}

export function formatDateToISO(input: string): string {
  if(input.length !== 10 || !input.includes('/')) {
    return input;
  }
  const [day, month, year] = input.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}