export function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function getWeekKey(dateStr) {
  const d = new Date(dateStr)
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export function getDaysRemaining(deadline) {
  if (!deadline) return null
  return Math.ceil((new Date(deadline) - new Date(getToday())) / 86400000)
}

export function getStreak(habitId, checkins) {
  let streak = 0
  const d = new Date(getToday())
  while (true) {
    const key = d.toISOString().slice(0, 10)
    if (checkins[key]?.[habitId]) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function getMilestoneProgress(milestones) {
  if (!milestones?.length) return 0
  return Math.round((milestones.filter(m => m.done).length / milestones.length) * 100)
}
