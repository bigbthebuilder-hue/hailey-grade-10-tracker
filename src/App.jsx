import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  Download,
  Upload,
  RotateCcw,
  NotebookPen,
  Plus,
  Sparkles,
  Trophy,
  MessageSquare,
  Drum,
  Feather,
  Globe2,
  Calculator,
  FlaskConical,
  Mountain,
  Users,
  Landmark,
  TrendingUp,
  Trees,
  BookOpen,
  PenSquare,
  AudioLines,
  Compass,
  Microscope,
  Atom,
  Orbit,
  Leaf,
  Sigma,
  Ruler,
  Triangle,
  BarChart3,
  PiggyBank,
} from 'lucide-react';
import './style.css';
import heroDrumBg from './hero-drum-bg.png';

const STORAGE_KEY = 'wcln-course-tracker-v5';

const seedCourses = [
  {
    id: 'efp10', name: 'English First Peoples 10 - WCLN', note: 'Uploaded 2025 WCLN outline.',
    units: [
      { id: 'efp10-u1', name: 'Unit 1: Connections to Place', items: [
        ['Base Writing Assessment',6,'Assignment'],['QUIZ: Apostrophes and Capitalization',15,'Quiz'],['1.1 Traditional Introduction',12,'Lesson'],['1.2 Snapshot',12,'Lesson'],['1.3 Exploring Place in Text',12,'Lesson'],['1.4 Formal Literary Response',12,'Assignment'],['Quiz: Sentence Fragments Quiz',15,'Quiz'],['1.5 Extended Metaphor',12,'Lesson'],['1.6C PROJECT: Descriptive Final Draft',24,'Project']
      ]},
      { id: 'efp10-u2', name: 'Unit 2: Indigenous Storytelling Traditions', items: [
        ['2.1 Plot',12,'Lesson'],['2.2 Setting and Conflict',12,'Lesson'],['Quiz: Run-On Sentences Quiz',12,'Quiz'],['2.3 Characters',12,'Lesson'],['QUIZ: Elements of Fiction',15,'Quiz'],['2.4 Creation Stories',12,'Lesson'],['2.6C PROJECT: Narrative Final Draft',24,'Project']
      ]},
      { id: 'efp10-u3', name: 'Unit 3: Independent Novel Study', items: [
        ['3.1 Reading Plan',6,'Assignment'],['3.2 Response Log',12,'Assignment'],['3.4 FINAL PROJECT: Novel Study',24,'Project']
      ]},
      { id: 'efp10-u4', name: 'Unit 4: Personal and Cultural Identity', items: [
        ['4.1 Personal Identity',12,'Lesson'],['4.2 Cultural Identity',12,'Lesson'],['4.3 Analyzing Poetry',12,'Lesson'],['QUIZ: Poetic Devices',20,'Quiz'],['Quiz: Common Errors',15,'Quiz'],['4.4 Cultural Differences',12,'Lesson'],['4.5 Global First Peoples',12,'Lesson'],['4.6C PROJECT: Expository Final Draft',24,'Project']
      ]},
      { id: 'efp10-u5', name: 'Unit 5: Power of Voices (Oral Traditions)', items: [
        ['5.1 Voice and Performance Techniques',12,'Lesson'],['5.2 Language and Performance',12,'Lesson'],['5.3 Point of View',12,'Lesson'],['5.4 Theme',12,'Lesson'],['QUIZ: Agreement Quiz',15,'Quiz'],['5.5 Global Change Makers',12,'Lesson'],['QUIZ: Comma and Semicolon',12,'Quiz'],['5.6C PROJECT: Persuasive Final Draft',24,'Project']
      ]},
      { id: 'efp10-u6', name: 'Unit 6: Past, Present and Future', items: [
        ['6.1 Residential Schools',12,'Lesson'],['6.2 Bearing Witness',12,'Lesson'],['6.3 Days of Celebration',12,'Lesson'],['QUIZ: Modifier Quiz',15,'Quiz'],['6.4 Public Service Announcement',12,'Assignment'],['6.5 Annotated Bibliography',12,'Assignment'],['6.6C PROJECT: Synthesis Final Draft',24,'Project'],['Final Exam',34,'Exam']
      ]}
    ]
  },
  {
    id: 'ss10', name: 'Social Studies 10 - WCLN', note: 'Choice items are included by default. Choice items are highlighted. Once a choice is met, the remaining choices change to optional.',
    units: [
      { id: 'ss10-intro', name: 'Introduction: Immigration to Canada', items: [['Introductory Assignment',12,'Assignment'],['Intro Quiz',10,'Quiz']]},
      { id: 'ss10-u1', name: 'Unit 1: WWI Era', items: [['Section 1.1: Assignment',24,'Assignment'],['Section 1.1: Quiz',10,'Quiz'],['Section 1.2: Assignment',16,'Assignment'],['Section 1.2: Quiz',10,'Quiz'],['Section 1.3: Assignment',16,'Assignment'],['Section 1.3: Quiz',10,'Quiz'],['Section 1.4: Assignment',18,'Assignment'],['Section 1.4: Quiz',10,'Quiz'],['Unit 1 Project',24,'Project'],['Unit 1 Test',36,'Test']]},
      { id: 'ss10-u2', name: 'Unit 2: WW2 Era', items: [['Section 2.1: Quiz',10,'Quiz'],['Section 2.2: Quiz',10,'Quiz'],['Section 2.3: Quiz',10,'Quiz'],['Section 2.4: Quiz',10,'Quiz'],['Unit 2 Project',16,'Project'],['Unit 2 Test',36,'Test']]},
      { id: 'ss10-u3', name: 'Unit 3: After WW2', items: [['Section 3.1: Quiz',10,'Quiz'],['Section 3.2: Quiz',10,'Quiz'],['Section 3.3: Quiz',10,'Quiz'],['Unit 3 Project',16,'Project'],['Unit 3 Test',36,'Test']]},
      { id: 'ss10-u4', name: 'Unit 4: Government', items: [['Section 4.1: Assignment',16,'Assignment'],['Section 4.1: Quiz',10,'Quiz'],['Section 4.2: Assignment',25,'Assignment'],['Section 4.2: Quiz',10,'Quiz'],['Section 4.3: Assignment',16,'Assignment'],['Section 4.3: Quiz',10,'Quiz'],['Section 4.4: Assignment',13,'Assignment'],['Section 4.4: Quiz',10,'Quiz'],['Unit 4 Project',24,'Project'],['Unit 4 Test',36,'Test']]},
      { id: 'ss10-u5', name: 'Unit 5: Culture', items: [['Section 5.1: Assignment',20,'Assignment'],['Section 5.1: Quiz',10,'Quiz'],['Section 5.2: Assignment',20,'Assignment'],['Section 5.2: Quiz',10,'Quiz'],['Section 5.3: Assignment',24,'Assignment'],['Section 5.3: Quiz',10,'Quiz'],['Section 5.4: Assignment',16,'Assignment'],['Section 5.4: Quiz',10,'Quiz'],['Section 5.5: Assignment',16,'Assignment'],['Section 5.5: Quiz',10,'Quiz'],['Unit 5 Project',24,'Project'],['Unit 5 Test',36,'Test']]},
      { id: 'ss10-u6', name: 'Unit 6: Human Rights', items: [['Section 6.1: Quiz',10,'Quiz'],['Section 6.2: Assignment',28,'Assignment'],['Section 6.2: Quiz',10,'Quiz'],['Section 6.3: Assignment',16,'Assignment'],['Section 6.3: Quiz',10,'Quiz'],['Section 6.4: Assignment',20,'Assignment'],['Section 6.4: Quiz',10,'Quiz'],['Unit 6 Project',24,'Project'],['Unit 6 Test',36,'Test']]}
    ]
  },
  {
    id: 'wpmath10', name: 'Workplace Math 10 - WCLN', note: 'Minimum 4 projects. Projects are highlighted as choices. Once 4 are complete, the rest become optional.',
    units: ['Numeracy','Measurements','Geometry','Trigonometry','Averages','Data Analysis','Graphing & Tables','Finances'].map((name, i) => {
      const n = i + 1;
      const tests = ['Numeracy','Measurement','Geometry','Trigonometry','Averages','Data Analysis','Graphing & Tables','Finances'];
      const quizMarks = [[9,6],[5,8],[6,5],[5,5],[4,5],[5],[6,6],[5,6]][i];
      return {
        id:`wpmath10-u${n}`,
        name:`Unit ${n}: ${name}`,
        items:[
          [`Unit ${n} Learning Guide`,10,'Learning Guide'],
          ...quizMarks.map((m,idx) => [`Quiz ${idx + 1}`,m,'Quiz']),
          [`Unit ${n} Project`,12,'Project'],
          [`Unit ${n} Test: ${tests[i]}`,[16,15,15,15,14,12,15,18][i],'Test']
        ]
      };
    })
  },
  {
    id: 'science10', name: 'Science 10 - WCLN', note: 'Unit 1-4 tests are invigilated according to the outline.',
    units: [
      { id: 'science10-u1', name: 'Big Idea 1: Biology', items: [['Learning Guide',10,'Learning Guide'],['Unit 1 Quiz 1',6,'Quiz'],['Unit 1 Quiz 2',6,'Quiz'],['Unit 1 Quiz 3',5,'Quiz'],['Biology Project',12,'Project'],['Biology Test',30,'Test']]},
      { id: 'science10-u2', name: 'Big Idea 2: Chemistry', items: [['Learning Guide',10,'Learning Guide'],['Unit 2 Quiz 1',8,'Quiz'],['Unit 2 Quiz 2',8,'Quiz'],['Unit 2 Quiz 3',10,'Quiz'],['Chemistry Project',12,'Project'],['Chemistry Test',30,'Test']]},
      { id: 'science10-u3', name: 'Big Idea 3: Physics', items: [['Learning Guide',10,'Learning Guide'],['Unit 3 Quiz 1',7,'Quiz'],['Unit 3 Quiz 2',8,'Quiz'],['Unit 3 Quiz 3',8,'Quiz'],['Physics Project',12,'Project'],['Physics Test',30,'Test']]},
      { id: 'science10-u4', name: 'Big Idea 4: Earth Science', items: [['Learning Guide',10,'Learning Guide'],['Unit 4 Quiz 1',8,'Quiz'],['Unit 4 Quiz 2',8,'Quiz'],['Unit 4 Quiz 3',6,'Quiz'],['Earth Science Project',12,'Project'],['Earth Science Test',30,'Test']]}
    ]
  }
];

const courseMeta = {
  efp10: { icon: Feather, accent: 'efp' },
  ss10: { icon: Globe2, accent: 'ss' },
  wpmath10: { icon: Calculator, accent: 'math' },
  science10: { icon: FlaskConical, accent: 'science' },
};

function getUnitMeta(unit) {
  const label = unit.name.toLowerCase();

  if (unit.id.startsWith('ss10')) {
    if (label.includes('wwi') || label.includes('immigration')) return { icon: Mountain, accent: 'purple' };
    if (label.includes('ww2') || label.includes('culture')) return { icon: Users, accent: 'teal' };
    if (label.includes('after ww2') || label.includes('government')) return { icon: Landmark, accent: 'violet' };
    return { icon: TrendingUp, accent: 'lime' };
  }

  if (unit.id.startsWith('efp10')) {
    if (label.includes('place')) return { icon: Trees, accent: 'green' };
    if (label.includes('story')) return { icon: BookOpen, accent: 'purple' };
    if (label.includes('novel')) return { icon: PenSquare, accent: 'teal' };
    if (label.includes('identity')) return { icon: Compass, accent: 'violet' };
    if (label.includes('voices')) return { icon: AudioLines, accent: 'lime' };
    return { icon: Leaf, accent: 'green' };
  }

  if (unit.id.startsWith('wpmath10')) {
    if (label.includes('numeracy')) return { icon: Sigma, accent: 'blue' };
    if (label.includes('measurement')) return { icon: Ruler, accent: 'teal' };
    if (label.includes('geometry')) return { icon: Triangle, accent: 'purple' };
    if (label.includes('trigonometry')) return { icon: Compass, accent: 'violet' };
    if (label.includes('averages')) return { icon: BarChart3, accent: 'lime' };
    if (label.includes('data')) return { icon: TrendingUp, accent: 'teal' };
    if (label.includes('graphing')) return { icon: BarChart3, accent: 'blue' };
    return { icon: PiggyBank, accent: 'lime' };
  }

  if (unit.id.startsWith('science10')) {
    if (label.includes('biology')) return { icon: Microscope, accent: 'green' };
    if (label.includes('chemistry')) return { icon: FlaskConical, accent: 'teal' };
    if (label.includes('physics')) return { icon: Atom, accent: 'purple' };
    return { icon: Orbit, accent: 'blue' };
  }

  return { icon: BookOpen, accent: 'purple' };
}

function buildItems() {
  return seedCourses.flatMap(course =>
    course.units.flatMap(unit =>
      unit.items.map((arr, idx) => ({
        id: `${unit.id}-${idx}`,
        courseId: course.id,
        courseName: course.name,
        unitId: unit.id,
        unitName: unit.name,
        title: arr[0],
        marks: arr[1] || 0,
        type: arr[2] || 'Item',
        done: false,
        counts: true,
        completedDate: '',
        note: '',
      }))
    )
  );
}

function blankState() {
  return {
    items: buildItems(),
    courseNotes: {},
    showCompleted: {},
  };
}

function loadState() {
  const keys = [
    STORAGE_KEY,
    'wcln-course-tracker-v4',
    'wcln-course-tracker-v3',
    'wcln-course-tracker-v2',
    'wcln-course-tracker-v1',
  ];

  for (const key of keys) {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved?.items?.length) {
        return {
          ...blankState(),
          ...saved,
          items: saved.items.map(item => ({
            ...item,
            note: item.note || item.notes || '',
          })),
        };
      }
    } catch {}
  }

  return blankState();
}

function cleanCourseName(name) {
  return name.replace(' - WCLN', '');
}

function getChoiceRule(item) {
  const isSectionAssignment = item.courseId === 'ss10'
    && ['ss10-u1','ss10-u4','ss10-u5','ss10-u6'].includes(item.unitId)
    && item.type === 'Assignment'
    && item.title.startsWith('Section ');
  if (isSectionAssignment) {
    return { groupId: `${item.unitId}-choose-section-assignments`, limit: 2, label: 'Choose 2 section assignments' };
  }

  const isSocialsProjectOrTest = item.courseId === 'ss10'
    && /^ss10-u[1-6]$/.test(item.unitId)
    && ['Project','Test'].includes(item.type)
    && item.title.startsWith('Unit ');
  if (isSocialsProjectOrTest) {
    return { groupId: `${item.unitId}-choose-project-test`, limit: 1, label: 'Choose 1 project or test' };
  }

  const isMathProject = item.courseId === 'wpmath10' && item.type === 'Project';
  if (isMathProject) {
    return { groupId: 'wpmath10-choose-four-projects', limit: 4, label: 'Complete 4 math projects' };
  }

  return null;
}

function getChoiceStatus(item, allItems) {
  const rule = getChoiceRule(item);
  if (!rule) return { rule: null, className: '', badge: '', autoCounts: true };

  const members = allItems.filter(i => getChoiceRule(i)?.groupId === rule.groupId && i.counts !== false);
  const doneCount = members.filter(i => i.done).length;

  if (item.done) return { rule, className: 'choiceSelected', badge: `${rule.label} • chosen`, autoCounts: true };
  if (doneCount >= rule.limit) return { rule, className: 'optionalNow', badge: 'Optional now — choice already met', autoCounts: false };
  return { rule, className: 'choiceAvailable', badge: rule.label, autoCounts: true };
}

function progressFor(scopeItems, allItems) {
  const countedItems = scopeItems.filter(item => {
    const choice = getChoiceStatus(item, allItems);
    return item.counts !== false && choice.autoCounts;
  });

  const total = countedItems.length;
  const done = countedItems.filter(item => item.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return { total, done, pct, countedItems };
}

function buildCoursesWithItems(items) {
  return seedCourses.map(course => ({
    ...course,
    items: items.filter(item => item.courseId === course.id),
    units: course.units.map(unit => ({ ...unit, items: items.filter(item => item.unitId === unit.id) })),
  }));
}

function getNextItem(items) {
  return items.find(item => {
    const choice = getChoiceStatus(item, items);
    return !item.done && item.counts !== false && choice.autoCounts;
  }) || null;
}

function buildStickers(courses, items, stats) {
  const unitProgress = courses.flatMap(course => course.units.map(unit => progressFor(unit.items, items)));
  const completeUnits = unitProgress.filter(unit => unit.total > 0 && unit.done === unit.total).length;
  const courseProgress = courses.map(course => progressFor(course.items, items));
  const completeCourses = courseProgress.filter(course => course.total > 0 && course.done === course.total).length;
  const doneItems = stats.done;

  return [
    { id: 'first-step', emoji: '⭐', title: 'First Step', description: 'Completed your first counted item.', unlocked: doneItems >= 1, accent: 'violet' },
    { id: 'momentum', emoji: '⚡', title: 'Momentum', description: 'Finished 5 counted items.', unlocked: doneItems >= 5, accent: 'lime' },
    { id: 'playlist', emoji: '🎧', title: 'Playlist Grind', description: 'Finished 10 counted items.', unlocked: doneItems >= 10, accent: 'teal' },
    { id: 'unit-rider', emoji: '🛹', title: 'Unit Rider', description: 'Completed 1 full unit.', unlocked: completeUnits >= 1, accent: 'blue' },
    { id: 'drum-fill', emoji: '🥁', title: 'Drum Fill', description: 'Completed 3 full units.', unlocked: completeUnits >= 3, accent: 'violet' },
    { id: 'snow-day', emoji: '🏂', title: 'Snow Day', description: 'Completed 5 full units.', unlocked: completeUnits >= 5, accent: 'teal' },
    { id: 'guitar-hero', emoji: '🎸', title: 'Course Cleared', description: 'Completed one full course.', unlocked: completeCourses >= 1, accent: 'lime' },
    { id: 'legend', emoji: '🔥', title: 'Grade 10 Legend', description: 'Completed every counted item in the tracker.', unlocked: stats.total > 0 && stats.done === stats.total, accent: 'gold' },
  ];
}

function HeroProgressOverlay({ pct }) {
  return (
    <div className="heroVisual">
      <div className="heroProgressMount" style={{ '--pct': `${pct}%` }}>
        <div className="heroProgressArc" />
        <div className="heroPercent">{pct}%</div>
      </div>
    </div>
  );
}

function StickerBoard({ stickers, activeStickerId, setActiveStickerId }) {
  const activeSticker = stickers.find(sticker => sticker.id === activeStickerId) || stickers.find(sticker => sticker.unlocked) || stickers[0];
  const unlockedCount = stickers.filter(sticker => sticker.unlocked).length;

  return (
    <section className="stickerBoard">
      <div className="sectionHead compact">
        <div>
          <p className="eyebrow minor">Hailey's Sticker Board</p>
          <h2>Earned vibes</h2>
        </div>
        <span className="counterPill">{unlockedCount}/{stickers.length}</span>
      </div>

      <div className="stickerGrid">
        {stickers.map(sticker => (
          <button
            key={sticker.id}
            className={`sticker ${sticker.accent} ${sticker.unlocked ? 'unlocked' : 'locked'} ${activeSticker?.id === sticker.id ? 'active' : ''}`}
            onClick={() => setActiveStickerId(sticker.id)}
            type="button"
          >
            <span className="stickerEmoji">{sticker.emoji}</span>
            <strong>{sticker.title}</strong>
          </button>
        ))}
      </div>

      {activeSticker && (
        <div className={`stickerInfo ${activeSticker.unlocked ? 'unlocked' : 'locked'}`}>
          <div className="stickerInfoEmoji">{activeSticker.emoji}</div>
          <div>
            <strong>{activeSticker.title}</strong>
            <p>{activeSticker.description}</p>
          </div>
          <span className="statusTag">{activeSticker.unlocked ? 'Unlocked' : 'Locked'}</span>
        </div>
      )}
    </section>
  );
}

function CoursePanel({ course, state, save }) {
  const meta = courseMeta[course.id] || { icon: BookOpen, accent: 'efp' };
  const CourseIcon = meta.icon;
  const items = state.items.filter(item => item.courseId === course.id);
  const progress = progressFor(items, state.items);
  const nextItem = getNextItem(items);
  const courseNote = state.courseNotes?.[course.id] || '';

  function updateCourseNote(value) {
    save({ ...state, courseNotes: { ...state.courseNotes, [course.id]: value } });
  }

  function updateItem(itemId, patch) {
    save({ ...state, items: state.items.map(item => item.id === itemId ? { ...item, ...patch } : item) });
  }

  function toggleDone(item) {
    updateItem(item.id, { done: !item.done });
  }

  return (
    <details className="coursePanel">
      <summary className="courseButton">
        <div className={`courseIcon courseIcon-${meta.accent}`}><CourseIcon size={24} /></div>
        <div className="courseButtonMain">
          <strong>{cleanCourseName(course.name)}</strong>
          <span>{progress.done} of {progress.total} counted items complete</span>
          {nextItem ? <em>Next up: {nextItem.unitName} — {nextItem.title}</em> : <em>Everything currently counted here is complete.</em>}
        </div>
        <div className="courseButtonRight">
          <b>{progress.pct}%</b>
          <ChevronDown className="chev" size={24} />
        </div>
        <div className="courseBar"><i style={{ width: `${progress.pct}%` }} /></div>
      </summary>

      <div className="courseInside">
        <p className="courseNoteLine">{course.note}</p>

        <label className="teacherNotes">
          <span><NotebookPen size={18} /> Questions / notes for teacher</span>
          <textarea
            value={courseNote}
            onChange={e => updateCourseNote(e.target.value)}
            placeholder="Write questions, reminders, missing marks, or things to ask your teacher about this course..."
          />
        </label>

        <div className="unitGrid">
          {course.units.map(unit => (
            <UnitPanel
              key={unit.id}
              unit={unit}
              state={state}
              items={items.filter(item => item.unitId === unit.id)}
              updateItem={updateItem}
              toggleDone={toggleDone}
              save={save}
            />
          ))}
        </div>
      </div>
    </details>
  );
}

function UnitPanel({ unit, state, items, updateItem, toggleDone, save }) {
  const meta = getUnitMeta(unit);
  const UnitIcon = meta.icon;
  const progress = progressFor(items, state.items);
  const remaining = items.filter(item => !item.done);
  const completed = items.filter(item => item.done);
  const showCompleted = !!state.showCompleted?.[unit.id];

  function toggleShowCompleted(e) {
    e.preventDefault();
    e.stopPropagation();
    save({ ...state, showCompleted: { ...state.showCompleted, [unit.id]: !showCompleted } });
  }

  return (
    <details className="unitPanel">
      <summary className="unitButton">
        <div className={`unitIcon unitIcon-${meta.accent}`}><UnitIcon size={20} /></div>
        <div className="unitButtonMain">
          <strong>{unit.name}</strong>
          <span>{progress.done} of {progress.total} counted items complete</span>
        </div>
        <div className="unitButtonRight">
          <b>{progress.pct}%</b>
          <ChevronDown className="unitChev" size={22} />
        </div>
        <div className="unitBar"><i style={{ width: `${progress.pct}%` }} /></div>
      </summary>

      <div className="unitInside">
        {remaining.length === 0 && <div className="emptyDone">All visible items in this unit are complete.</div>}

        {remaining.map(item => (
          <ItemRow key={item.id} item={item} allItems={state.items} updateItem={updateItem} toggleDone={toggleDone} />
        ))}

        {completed.length > 0 && (
          <button className="ghostButton" onClick={toggleShowCompleted} type="button">
            {showCompleted ? 'Hide completed items' : `Show completed items (${completed.length})`}
          </button>
        )}

        {showCompleted && completed.map(item => (
          <ItemRow key={item.id} item={item} allItems={state.items} updateItem={updateItem} toggleDone={toggleDone} />
        ))}
      </div>
    </details>
  );
}

function ItemRow({ item, allItems, updateItem, toggleDone }) {
  const choice = getChoiceStatus(item, allItems);
  const countsLocked = choice.rule && !choice.autoCounts && !item.done;
  const countsEffective = item.counts !== false && choice.autoCounts;

  return (
    <div className={`itemRow ${item.done ? 'done' : ''} ${choice.className}`}>
      <button className="checkButton" onClick={() => toggleDone(item)} aria-label={item.done ? 'Mark incomplete' : 'Mark complete'} type="button">
        {item.done ? <CheckCircle2 /> : <Circle />}
      </button>

      <div className="itemMain">
        <strong>{item.title}</strong>
        <small>{item.type} • {item.marks || 0} marks</small>
        {choice.badge && <div className={`choiceBadge ${choice.className}`}>{choice.badge}</div>}
        <textarea className="itemNote" value={item.note || ''} onChange={e => updateItem(item.id, { note: e.target.value })} placeholder="Optional note for this item..." />
      </div>

      <div className="countsWrap">
        <label className={`countsToggle ${countsLocked ? 'disabled' : ''}`}>
          <input type="checkbox" checked={countsEffective} disabled={countsLocked} onChange={e => updateItem(item.id, { counts: e.target.checked })} />
          Include in progress
        </label>
        {countsLocked && <small className="countsHelp">Handled automatically</small>}
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [addCourseId, setAddCourseId] = useState(seedCourses[0].id);
  const [activeStickerId, setActiveStickerId] = useState('first-step');

  const items = state.items;
  const addCourse = seedCourses.find(course => course.id === addCourseId) || seedCourses[0];
  const courses = useMemo(() => buildCoursesWithItems(items), [items]);
  const stats = useMemo(() => progressFor(items, items), [items]);
  const stickers = useMemo(() => buildStickers(courses, items, stats), [courses, items, stats]);
  const nextItem = useMemo(() => getNextItem(items), [items]);

  function save(next) {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hailey-grade-10-tracker-backup.json';
    a.click();
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.items) save({ ...blankState(), ...data });
      } catch {
        alert('That file could not be imported.');
      }
    };
    reader.readAsText(file);
  }

  function reset() {
    if (confirm('Reset all progress and notes back to blank?')) save(blankState());
  }

  function addItem(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const courseId = fd.get('courseId');
    const course = seedCourses.find(c => c.id === courseId);
    const unitId = fd.get('unitId');
    const unit = course?.units.find(u => u.id === unitId);
    const title = fd.get('title')?.trim();
    if (!course || !unit || !title) return;

    const item = {
      id: `custom-${Date.now()}`,
      courseId: course.id,
      courseName: course.name,
      unitId: unit.id,
      unitName: unit.name,
      title,
      marks: Number(fd.get('marks')) || 0,
      type: fd.get('type') || 'Item',
      done: false,
      counts: true,
      completedDate: '',
      note: '',
    };

    save({ ...state, items: [...items, item] });
    e.currentTarget.reset();
  }

  return (
    <div className="app theme-hailey">
      <header className="hero" style={{ '--hero-bg': `url(${heroDrumBg})` }}>
        <div className="heroCopy">
          <p className="eyebrow">Hailey's Grade 10 Tracker</p>
          <h1>Stay curious.<br />Keep progressing.</h1>
          <p className="heroText">Music. Snowboarding. Skateboarding. Getting school done. This tracker saves progress right on this phone.</p>

          <div className="miniStats">
            <div className="miniStat"><Sparkles size={16} /><span>{stats.done} counted items done</span></div>
            <div className="miniStat"><Trophy size={16} /><span>{courses.filter(course => progressFor(course.items, items).pct === 100 && progressFor(course.items, items).total > 0).length} courses cleared</span></div>
            <div className="miniStat"><MessageSquare size={16} /><span>{Object.values(state.courseNotes || {}).filter(Boolean).length} course note areas started</span></div>
          </div>

          {nextItem && (
            <div className="nextUpCard">
              <div className="nextUpBadge"><Drum size={18} /></div>
              <div>
                <strong>Next up</strong>
                <p>{cleanCourseName(nextItem.courseName)} — {nextItem.unitName} — {nextItem.title}</p>
              </div>
            </div>
          )}
        </div>

        <HeroProgressOverlay pct={stats.pct} />
      </header>

      <StickerBoard stickers={stickers} activeStickerId={activeStickerId} setActiveStickerId={setActiveStickerId} />

      <main className="courseStack">
        {courses.map(course => <CoursePanel key={course.id} course={course} state={state} save={save} />)}
      </main>

      <details className="toolsPanel">
        <summary>Backup, reset, or add items later</summary>
        <div className="toolsInside">
          <button type="button" onClick={exportData}><Download size={18} /> Export backup</button>
          <label className="button"><Upload size={18} /> Import backup<input type="file" accept="application/json" onChange={importData} /></label>
          <button type="button" className="danger" onClick={reset}><RotateCcw size={18} /> Reset</button>

          <form className="addForm" onSubmit={addItem}>
            <h2><Plus size={20} /> Add an extra item later</h2>
            <select name="courseId" value={addCourseId} onChange={e => setAddCourseId(e.target.value)}>
              {seedCourses.map(course => <option key={course.id} value={course.id}>{cleanCourseName(course.name)}</option>)}
            </select>
            <select name="unitId" defaultValue={addCourse.units[0].id} key={addCourse.id}>
              {addCourse.units.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
            </select>
            <input name="title" placeholder="Lesson / quiz / assignment" />
            <input name="type" placeholder="Type" />
            <input name="marks" type="number" placeholder="Marks" />
            <button type="submit">Add item</button>
          </form>
        </div>
      </details>
    </div>
  );
}
