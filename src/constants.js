export const CATEGORIES = {
  health: {
    label: '健康・フィットネス',
    icon: '💪',
    text: '#059669',
    lightBg: '#ecfdf5',
    lightBorder: '#a7f3d0',
    bar: '#10b981',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
  },
  career: {
    label: '仕事・キャリア',
    icon: '💼',
    text: '#1d4ed8',
    lightBg: '#eff6ff',
    lightBorder: '#bfdbfe',
    bar: '#3b82f6',
    badgeBg: '#dbeafe',
    badgeText: '#1e3a8a',
  },
  learning: {
    label: '学習・スキルアップ',
    icon: '📚',
    text: '#7c3aed',
    lightBg: '#f5f3ff',
    lightBorder: '#ddd6fe',
    bar: '#8b5cf6',
    badgeBg: '#ede9fe',
    badgeText: '#4c1d95',
  },
  finance: {
    label: '財務・資産形成',
    icon: '💰',
    text: '#b45309',
    lightBg: '#fffbeb',
    lightBorder: '#fde68a',
    bar: '#f59e0b',
    badgeBg: '#fef3c7',
    badgeText: '#78350f',
  },
}

export const HABIT_EMOJIS = [
  '🎯','💪','🏃','🧘','🥗','💤','📚','✍️','🖥️','🧠',
  '💰','📝','🤸','🎵','💊','🚴','🥤','🧹','🌿','⏰',
]

export const INITIAL_DATA = {
  goals: {
    health:   { title: '', description: '', deadline: '', milestones: [] },
    career:   { title: '', description: '', deadline: '', milestones: [] },
    learning: { title: '', description: '', deadline: '', milestones: [] },
    finance:  { title: '', description: '', deadline: '', milestones: [] },
  },
  habits: [],
  checkins: {},
  reviews: {},
}
