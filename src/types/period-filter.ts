export enum PeriodFilter {
  ALL = "all",
  TODAY = "today",
  THIS_WEEK = "week",
  THIS_MONTH = "month",
}

export function getPeriodEventRequestToPtBr(period: PeriodFilter) {
  switch (period) {
    case PeriodFilter.TODAY:
      return "Hoje";
    case PeriodFilter.THIS_WEEK:
      return "Esta semana";
    case PeriodFilter.THIS_MONTH:
      return "Este mês";
    case PeriodFilter.ALL:
      return "Todos";
    default:
      return "Todos";
  }
}
