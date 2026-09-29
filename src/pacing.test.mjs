import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildPacing, defaultSchedule, normalizeSchedule, workdays } from './pacing.mjs';

// Exercise the actual outline and choice rules, including zero-mark PHE work.
const source = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8');
const fixture = vm.runInNewContext(`${source.slice(source.indexOf('const seedCourses'), source.indexOf('const courseMeta'))}
${source.slice(source.indexOf('function buildItems'), source.indexOf('function blankState'))}
${source.slice(source.indexOf('function getChoiceRule'), source.indexOf('function getChoiceStatus'))}
({ courses: seedCourses, items: buildItems(), choiceRule: getChoiceRule })`);
const fresh = () => ({ items: structuredClone(fixture.items), activityHours: {}, activityHistory: [], schedule: { ...defaultSchedule } });
const run = (state, day = '2026-09-29') => buildPacing(state, fixture.courses, fixture.choiceRule, new Date(`${day}T12:00:00`));

test('zero progress has daily work, activity time, and five mixed suggestions', () => {
  const p = run(fresh());
  assert.equal(p.status, 'Ready to start');
  assert.ok(p.dailyGoal > 0);
  assert.equal(p.remainingHours, 180);
  assert.equal(p.suggestions.length, 5);
  assert.ok(p.suggestions.some(item => !/project|test|exam/i.test(item.type)));
  assert.ok(p.remaining < fixture.items.length);
});
test('choice alternatives, excluded items, and invalid units do not add required work', () => {
  const state = fresh();
  const before = run(state).remaining;
  const project = state.items.find(item => item.courseId === 'ss10' && item.type === 'Project');
  project.done = true;
  state.items.find(item => item.id === 'efp10-u1-0').counts = false;
  state.items.push({ id: 'custom-invalid', courseId: 'efp10', unitId: 'missing', counts: true });
  const p = run(state);
  assert.equal(p.remaining, before - 2);
  assert.ok(!p.suggestions.some(item => item.unitId === project.unitId && item.type === 'Test'));
});
test('started units come first and dates distinguish new from legacy completions', () => {
  const state = fresh();
  const item = state.items.find(item => item.courseId === 'science10');
  item.done = true; item.completedDate = '2026-09-29';
  state.items[0].done = true;
  const p = run(state);
  assert.equal(p.weekDone, 1);
  assert.equal(p.undated, true);
  assert.ok(p.suggestions.some(next => next.unitId === item.unitId));
  item.done = false; item.completedDate = '';
  assert.equal(run(state).weekDone, 0);
});
test('workdays handle weekends, partial weeks and daylight saving changes', () => {
  assert.equal(workdays('2026-09-28', '2026-10-04', 5), 5);
  assert.equal(workdays('2026-09-30', '2026-10-02', 3), 1);
  assert.equal(workdays('2026-10-30', '2026-11-02', 5), 2);
  assert.equal(run(fresh(), '2026-10-03').dailyGoal, 0);
  assert.equal(run(fresh(), '2026-09-01').dailyGoal, 0);
  const overdue = run(fresh(), '2027-06-28');
  assert.equal(overdue.status, 'Catch-up needed');
  assert.equal(overdue.remainingDays, 0);
  assert.ok(Number.isFinite(overdue.weekGoal));
});
test('weekly activity reports dated net changes without dating historical totals', () => {
  const state = fresh();
  state.activityHours = { 'phe10-log-1': 10 };
  state.activityHistory = [
    { date: '2026-09-22', delta: 8 },
    { date: '2026-09-28', delta: 3 },
    { date: '2026-09-29', delta: -1 },
  ];
  const p = run(state);
  assert.equal(p.weekHours, 2);
  assert.equal(p.remainingHours, 170);
});
test('invalid schedules recover and workload styles scale only daily goals', () => {
  assert.equal(normalizeSchedule({ schoolYearStart: 'bad', workDaysPerWeek: 90 }).schoolYearStart, defaultSchedule.schoolYearStart);
  assert.equal(normalizeSchedule({ workDaysPerWeek: 90 }).workDaysPerWeek, 7);
  const state = fresh();
  state.schedule.dailyWorkloadStyle = 'Light'; const light = run(state);
  state.schedule.dailyWorkloadStyle = 'Push'; const push = run(state);
  assert.ok(push.dailyGoal >= light.dailyGoal);
  assert.equal(push.weekGoal, light.weekGoal);
});
test('completed plan has no remaining suggestions or activity goals', () => {
  const state = fresh();
  state.items.forEach(item => { item.done = true; });
  state.activityHours = { 'phe10-log-1': 80, 'ftcd11-log-1': 100 };
  const p = run(state);
  assert.equal(p.remaining, 0);
  assert.equal(p.remainingHours, 0);
  assert.equal(p.dailyGoal, 0);
  assert.equal(p.suggestions.length, 0);
});
