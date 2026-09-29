export const defaultSchedule = {
  schoolYearStart: '2026-09-09', schoolYearEnd: '2027-06-25',
  workDaysPerWeek: 5, dailyWorkloadStyle: 'Balanced',
};

// Use local calendar dates; UTC conversion would shift evening completions.
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !isNaN(date) && dateKey(date) === value ? date : null;
}
export function normalizeSchedule(value = {}) {
  const schedule = { ...defaultSchedule, ...value };
  if (!parseDate(schedule.schoolYearStart) || !parseDate(schedule.schoolYearEnd) || schedule.schoolYearEnd < schedule.schoolYearStart) {
    schedule.schoolYearStart = defaultSchedule.schoolYearStart;
    schedule.schoolYearEnd = defaultSchedule.schoolYearEnd;
  }
  schedule.workDaysPerWeek = Math.max(1, Math.min(7, Math.round(Number(schedule.workDaysPerWeek) || 5)));
  if (!['Light', 'Balanced', 'Push'].includes(schedule.dailyWorkloadStyle)) schedule.dailyWorkloadStyle = 'Balanced';
  return schedule;
}
function shift(key, amount) {
  const date = parseDate(key);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}
export function workdays(start, end, days) {
  if (start > end) return 0;
  // Calendar-day arithmetic is independent of daylight saving time.
  const span = Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000) + 1;
  const weekday = (parseDate(start).getDay() + 6) % 7;
  let count = Math.floor(span / 7) * days;
  for (let i = 0; i < span % 7; i++) if ((weekday + i) % 7 < days) count++;
  return count;
}

export function buildPacing(state, courses, choiceRule, now = new Date()) {
  const schedule = normalizeSchedule(state.schedule);
  const today = dateKey(now);
  const weekStart = shift(today, -((now.getDay() + 6) % 7));
  const weekEnd = shift(weekStart, 6);
  const validItems = state.items.filter(item => item.counts !== false && courses.some(course => course.id === item.courseId && course.units.some(unit => unit.id === item.unitId)));
  // A choose-two group represents two requirements, not every available option.
  const groups = new Map();
  for (const item of validItems) {
    const rule = choiceRule(item);
    const key = rule?.groupId || item.id;
    if (!groups.has(key)) groups.set(key, { limit: rule?.limit || 1, items: [] });
    groups.get(key).items.push(item);
  }
  let total = 0, done = 0;
  const candidates = [], completed = [];
  const courseCounts = new Map();
  for (const group of groups.values()) {
    const finished = group.items.filter(item => item.done).sort((a, b) => (a.completedDate || '').localeCompare(b.completedDate || ''));
    const required = Math.min(group.limit, group.items.length);
    const credit = Math.min(required, finished.length);
    total += required;
    done += credit;
    completed.push(...finished.slice(0, credit));
    const courseId = group.items[0].courseId;
    const counts = courseCounts.get(courseId) || { total: 0, done: 0 };
    counts.total += required; counts.done += credit;
    courseCounts.set(courseId, counts);
    if (credit < required) candidates.push(...group.items.filter(item => !item.done));
  }
  const started = new Set(validItems.filter(item => item.done || item.note?.trim()).map(item => item.unitId));
  const ranked = [...candidates].sort((a, b) => {
    const ac = courseCounts.get(a.courseId), bc = courseCounts.get(b.courseId);
    return Number(started.has(b.unitId)) - Number(started.has(a.unitId)) || ac.done / ac.total - bc.done / bc.total;
  });
  const suggestions = [], pickedGroups = new Map(), pickedCourses = new Map();
  while (ranked.length && suggestions.length < 5) {
    // Spread work across courses, with at most one big assessment while smaller work exists.
    const big = item => /project|test|exam/i.test(item.type);
    const smallAvailable = ranked.some(item => !big(item));
    const eligible = ranked.filter(item => !(smallAvailable && suggestions.some(big) && big(item)));
    eligible.sort((a, b) => (pickedCourses.get(a.courseId) || 0) - (pickedCourses.get(b.courseId) || 0));
    const item = eligible[0];
    ranked.splice(ranked.indexOf(item), 1);
    const rule = choiceRule(item);
    if (rule) {
      const group = groups.get(rule.groupId);
      const used = pickedGroups.get(rule.groupId) || 0;
      if (used >= group.limit - group.items.filter(i => i.done).length) continue;
      pickedGroups.set(rule.groupId, used + 1);
    }
    suggestions.push(item);
    pickedCourses.set(item.courseId, (pickedCourses.get(item.courseId) || 0) + 1);
  }
  const hours = courses.filter(course => course.hourTarget).map(course => {
    const logged = (course.hourLogs || []).reduce((sum, log) => sum + Math.max(0, Number(state.activityHours?.[log.id]) || 0), 0);
    return { id: course.id, name: course.name, target: course.hourTarget, logged: Math.min(logged, course.hourTarget), remaining: Math.max(0, course.hourTarget - logged) };
  });
  const remaining = total - done;
  const remainingHours = hours.reduce((sum, course) => sum + course.remaining, 0);
  const remainingDays = workdays(today > schedule.schoolYearStart ? today : schedule.schoolYearStart, schedule.schoolYearEnd, schedule.workDaysPerWeek);
  const totalDays = workdays(schedule.schoolYearStart, schedule.schoolYearEnd, schedule.workDaysPerWeek);
  const elapsedDays = totalDays - remainingDays;
  const expected = totalDays ? elapsedDays / totalDays : 0;
  const hourTarget = hours.reduce((sum, course) => sum + course.target, 0);
  const progress = Math.min(total ? done / total : 1, hourTarget ? 1 - remainingHours / hourTarget : 1);
  const gap = progress - expected;
  let status = gap > .05 ? 'Ahead' : gap < -.15 ? 'Catch-up needed' : gap < -.05 ? 'Slightly behind' : 'On track';
  if (!done && hours.every(course => !course.logged)) status = 'Ready to start';
  if (today > schedule.schoolYearEnd && (remaining || remainingHours)) status = 'Catch-up needed';
  const weekDone = completed.filter(item => item.completedDate >= weekStart && item.completedDate <= today).length;
  const todayDone = completed.filter(item => item.completedDate === today).length;
  const weekHours = Math.max(0, (state.activityHistory || []).filter(event => event.date >= weekStart && event.date <= today).reduce((sum, event) => sum + event.delta, 0));
  const weekFrom = weekStart > schedule.schoolYearStart ? weekStart : schedule.schoolYearStart;
  const weekTo = weekEnd < schedule.schoolYearEnd ? weekEnd : schedule.schoolYearEnd;
  const weekDays = workdays(weekFrom, weekTo, schedule.workDaysPerWeek);
  const daysFromWeek = workdays(weekFrom, schedule.schoolYearEnd, schedule.workDaysPerWeek);
  const weekGoal = Math.min(remaining + weekDone, Math.ceil((remaining + weekDone) / Math.max(1, daysFromWeek) * weekDays));
  const weekHourGoal = (remainingHours + weekHours) / Math.max(1, daysFromWeek) * weekDays;
  const factor = { Light: .75, Balanced: 1, Push: 1.25 }[schedule.dailyWorkloadStyle];
  const isWorkday = today >= schedule.schoolYearStart && today <= schedule.schoolYearEnd && (now.getDay() + 6) % 7 < schedule.workDaysPerWeek;
  const dailyGoal = Math.min(remaining, Math.max(0, Math.ceil((remaining + todayDone) / Math.max(1, remainingDays) * factor) - todayDone));
  return { schedule, today, status, remaining, remainingHours, remainingDays, suggestions, hours,
    dailyGoal: isWorkday ? dailyGoal : 0, factor, isWorkday, weekGoal, weekDone, weekHourGoal, weekHours,
    weekRemaining: Math.max(0, weekGoal - weekDone), weekHoursRemaining: Math.max(0, weekHourGoal - weekHours),
    undated: completed.some(item => !item.completedDate),
  };
}
