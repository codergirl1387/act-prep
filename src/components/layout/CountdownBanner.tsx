'use client';

import { useEffect, useState } from 'react';
import { differenceInDays } from 'date-fns';

const EXAM_DATE = new Date('2026-04-11');

export function CountdownBanner() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.max(0, differenceInDays(EXAM_DATE, new Date())));
  }, []);

  if (days === null) return null;

  const urgent = days <= 7;
  const warning = days <= 21;

  const bgClass = urgent
    ? 'bg-red-600 text-white'
    : warning
    ? 'bg-amber-500 text-white'
    : 'bg-blue-600 text-white';

  return (
    <div className={`${bgClass} text-center py-2 px-4 text-sm font-semibold`}>
      {days === 0
        ? 'ACT is TODAY! You got this, Netra!'
        : `${days} day${days === 1 ? '' : 's'} until the ACT — April 11, 2026`}
    </div>
  );
}
