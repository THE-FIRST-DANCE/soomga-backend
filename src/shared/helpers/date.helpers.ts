const calculateBirthdateRange = (
  min: number,
  max: number,
): { start: Date; end: Date } => {
  const start = new Date();
  start.setFullYear(start.getFullYear() - max);
  start.setMonth(0);
  start.setDate(1);

  const end = new Date();
  end.setFullYear(end.getFullYear() - min);
  end.setMonth(11);
  end.setDate(31);

  return { start, end };
};

export const DateHelpers = {
  calculateBirthdateRange,
};
