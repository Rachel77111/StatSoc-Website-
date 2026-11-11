export type OpportunityStatus = 'upcoming' | 'available' | 'closed';

// Calendar dates close at the end of the selected day in Sydney, regardless of
// the visitor's timezone. Empty or invalid dates leave manual status in control.
export function opportunityStatus(value?: string, closesOn?: string, now = new Date()): OpportunityStatus {
  if (closesOn && /^\d{4}-\d{2}-\d{2}$/.test(closesOn)) {
    const parsed = new Date(`${closesOn}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === closesOn) {
      const parts = new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Sydney', year: 'numeric', month: '2-digit', day: '2-digit',
      }).formatToParts(now);
      const part = (type: string) => parts.find(value => value.type === type)?.value;
      const today = `${part('year')}-${part('month')}-${part('day')}`;
      if (today > closesOn) return 'closed';
    }
  }
  return value === 'upcoming' || value === 'closed' ? value : 'available';
}

export function isFeaturedOpportunity(value?: string, closesOn?: string, now = new Date()): boolean {
  return opportunityStatus(value, closesOn, now) === 'upcoming';
}
