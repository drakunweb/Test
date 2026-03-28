import { useState, useCallback } from 'react'
import { INITIAL_DATA } from './constants'
import { getToday, getWeekKey } from './utils'
import Dashboard from './components/Dashboard'
import Goals from './components/Goals'
import Habits from './components/Habits'
import Review from './components/Review'

const TABS = [
  { key: 'dashboard', label: 'ダッシュボード', icon: '📊' },
  { key: 'goals',     label: '目標・計画',     icon: '🎯' },
  { key: 'habits',    label: '習慣トラッカー', icon: '✅' },
  { key: 'review',    label: '週次振り返り',   icon: '📝' },
]

function loadData() {
  try {
    const s = localStorage.getItem('goal-dashboard-v1')
    if (s) return { ...INITIAL_DATA, ...JSON.parse(s) }
  } catch {}
  return INITIAL_DATA
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [data, setData] = useState(loadData)

  const save = (next) => {
    setData(next)
    try { localStorage.setItem('goal-dashboard-v1', JSON.stringify(next)) } catch {}
  }

  const handleUpdateGoal = useCallback((catKey, goal) =>
    save(d => ({ ...d, goals: { ...d.goals, [catKey]: goal } }))
  , [])

  const handleToggle = useCallback((habitId) => {
    const today = getToday()
    save(d => ({
      ...d,
      checkins: {
        ...d.checkins,
        [today]: { ...(d.checkins[today] || {}), [habitId]: !d.checkins[today]?.[habitId] },
      },
    }))
  }, [])

  const handleAddHabit = useCallback((habit) =>
    save(d => ({ ...d, habits: [...d.habits, habit] }))
  , [])

  const handleRemoveHabit = useCallback((id) =>
    save(d => ({ ...d, habits: d.habits.filter(h => h.id !== id) }))
  , [])

  const handleSaveReview = useCallback((weekKey, review) =>
    save(d => ({ ...d, reviews: { ...d.reviews, [weekKey]: review } }))
  , [])

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111827' }}>目標達成ダッシュボード</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>長期目標に向けて、毎日を積み上げましょう</p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', borderBottom: '2px solid #e5e7eb',
        marginBottom: 20, gap: 0, overflowX: 'auto',
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 16px', fontSize: 13, fontWeight: 500,
              border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: tab === t.key ? '2px solid #6366f1' : '2px solid transparent',
              color: tab === t.key ? '#6366f1' : '#6b7280',
              marginBottom: -2, whiteSpace: 'nowrap', fontFamily: 'inherit',
              transition: 'color .15s',
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'dashboard' && <Dashboard goals={data.goals} habits={data.habits} checkins={data.checkins} />}
      {tab === 'goals'     && <Goals goals={data.goals} onUpdate={handleUpdateGoal} />}
      {tab === 'habits'    && <Habits habits={data.habits} checkins={data.checkins} onToggle={handleToggle} onAdd={handleAddHabit} onRemove={handleRemoveHabit} />}
      {tab === 'review'    && <Review habits={data.habits} checkins={data.checkins} reviews={data.reviews} onSaveReview={handleSaveReview} />}
    </div>
  )
}
