export const PLANS = {
  weekly: {
    id: "weekly",
    label: "Weekly",
    amountKobo: 4900,
    price: "R49",
    per: "/ week",
    durationDays: 7,
  },
  monthly: {
    id: "monthly",
    label: "Monthly",
    amountKobo: 14900,
    price: "R149",
    per: "/ month",
    durationDays: 30,
  },
  quarterly: {
    id: "quarterly",
    label: "3-Month",
    amountKobo: 34900,
    price: "R349",
    per: "/ 3 months",
    durationDays: 90,
  },
};

export function getPlanDurationDays(planId) {
  return PLANS[planId]?.durationDays || 0;
}