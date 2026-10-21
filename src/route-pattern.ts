const MAX_ROUTE_MATCH_LENGTH: number = 4_096;

interface RouteSegment {
  literal: string;
  parameter: boolean;
  optional: boolean;
}

// Match RegExp's case folding without the Unicode flag, including characters
// whose uppercase form expands or would turn a non-ASCII character into ASCII.
function canonicalize(value: string): string {
  return value.replace(/[\s\S]/g, (character: string): string => {
    const upper: string = character.toUpperCase();
    return upper.length !== 1 || (character.charCodeAt(0) >= 128 && upper.charCodeAt(0) < 128)
      ? character
      : upper;
  });
}

function parseSegment(segment: string): RouteSegment | null {
  const parameter: RegExpExecArray | null = /^:[\w-]+(\?)?(.*)$/.exec(segment);
  if (parameter) {
    const suffix: string = parameter[2];
    if (suffix.includes('?')) return null;
    return { literal: canonicalize(suffix), parameter: true, optional: parameter[1] === '?' };
  }
  const optional: boolean = /^[\w-]+\?$/.test(segment);
  if (!optional && segment.includes('?')) return null;
  return { literal: canonicalize(optional ? segment.slice(0, -1) : segment), parameter: false, optional };
}

/**
 * Matches supported React Router patterns without constructing a regex from
 * route data. Returns null for unsupported or oversized inputs so callers can
 * decline destructive link handling.
 */
export function matchesRoutePattern(path: string, pattern: string): boolean | null {
  if (path.length > MAX_ROUTE_MATCH_LENGTH || pattern.length > MAX_ROUTE_MATCH_LENGTH) return null;
  const splat: boolean = pattern.endsWith('*');
  if (splat && pattern !== '*' && !pattern.endsWith('/*')) return null;
  const base: string = pattern.replace(/\/*\*?$/, '').replace(/^\/*/, '');
  if (base.includes('*')) return null;
  const segments: RouteSegment[] = [];
  for (const value of base === '' ? [] : base.split('/')) {
    const segment: RouteSegment | null = parseSegment(value);
    if (segment === null) return null;
    segments.push(segment);
  }
  if (!path.startsWith('/')) return false;
  const pathname: string = canonicalize(path.slice(1).replace(/\/+$/, ''));
  const parts: string[] = pathname === '' ? [] : pathname.split('/');

  // Each route segment visits each reachable path position once. Optional
  // segments cannot cause the exponential backtracking of a generated regex.
  const positions: Set<number> = new Set([0]);
  for (const segment of segments) {
    const next: Set<number> = new Set();
    for (const position of positions) {
      if (segment.optional && (!segment.parameter || segment.literal === '')) next.add(position);
      const part: string | undefined = parts[position];
      if (part === undefined) continue;
      const matches: boolean = segment.parameter
        ? part.endsWith(segment.literal) && part.length >= segment.literal.length + (segment.optional ? 0 : 1)
        : part === segment.literal;
      if (matches) next.add(position + 1);
    }
    positions.clear();
    for (const position of next) positions.add(position);
    if (positions.size === 0) return false;
  }
  if (!splat) return positions.has(parts.length);
  return [...positions].some((position: number): boolean =>
    parts.slice(position).every((part: string): boolean => !/[\r\n\u2028\u2029]/.test(part)),
  );
}
