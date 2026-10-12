// 알바셈 계산 로직 (화면과 분리해서 calc.test.mjs로 검증)
export const MIN_WAGE = 10320; // 2026년 최저시급
export const WEEKS_PER_MONTH = 365 / 7 / 12; // 약 4.345주
export const MAX_LEGAL_HOURS = 52;

// 근로자 부담률. 4대보험 = 국민연금 4.75 + 건강 3.595 + 장기요양 0.472 + 고용 0.9 (2026, 소득세 별도)
export const DEDUCT = {
  none: { label: '공제 없음', rate: 0 },
  freelance: { label: '3.3%', rate: 0.033 },
  insurance: { label: '4대보험', rate: 0.0972 },
};

export function calc({ wage, hours, overtime = false, deduct = 'none' }) {
  wage = Math.max(0, +wage || 0);
  hours = Math.max(0, +hours || 0);
  const base = wage * hours;
  // 주 15시간 이상이면 주휴, 40시간 넘어도 8시간분까지만
  const holidayHours = hours >= 15 ? (Math.min(hours, 40) / 40) * 8 : 0;
  const holiday = holidayHours * wage;
  // 5인 이상 사업장: 40시간 초과분 0.5배 가산 (1배는 base에 이미 포함)
  const extra = overtime ? Math.max(0, hours - 40) * wage * 0.5 : 0;
  const weekly = base + holiday + extra;
  const gross = weekly * WEEKS_PER_MONTH;
  const tax = gross * (DEDUCT[deduct]?.rate ?? 0);
  const r = Math.round;
  return {
    base: r(base), holiday: r(holiday), holidayHours, extra: r(extra),
    weekly: r(weekly), gross: r(gross), tax: r(tax), net: r(gross - tax),
    eligible: hours >= 15, shortBy: hours < 15 ? 15 - hours : 0,
    belowMin: wage > 0 && wage < MIN_WAGE, overLegal: hours > MAX_LEGAL_HOURS,
  };
}
