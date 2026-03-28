import { CATEGORIES } from '../constants'
import { getToday, getDaysRemaining, getMilestoneProgress } from '../utils'
import ProgressBar from './ProgressBar'

export default function Dashboard({ goals, habits, checkins }) {
  const today = getToday()
  const todayCheckins = checkins[today] || {}
  const doneCount = habits.filter(h => todayCheckins[h.id]).length
  const overallPct = habits.length > 0 ? Math.round((doneCount / habits.length) * 100) : 0

  const dateLabel = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })
  const encouragement =
    overallPct === 100 ? '🎉 完璧！今日の習慣を全て達成！' :
    overallPct >= 70   ? '👍 順調！もう少しで完了です' :
    overallPct >= 30   ? '💡 引き続き頑張りましょう！' :
                         '🌅 今日も一歩ずつ積み上げていきましょう'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)',
        borderRadius: 16, padding: 24, color: '#fff', boxShadow: '0 4px 20px rgba(99,102,241,.3)',
      }}>
        <p style={{ color: '#c7d2fe', fontSize: 13 }}>{dateLabel}</p>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>今日の進捗</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16 }}>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>
            {overallPct}<span style={{ fontSize: 24, color: '#c7d2fe' }}>%</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: 'rgba(255,255,255,.25)', borderRadius: 99, height: 12 }}>
              <div style={{
                height: 12, borderRadius: 99, background: '#fff',
                width: `${overallPct}%`, transition: 'width .7s ease',
              }} />
            </div>
            <p style={{ color: '#c7d2fe', fontSize: 12, marginTop: 6 }}>
              {doneCount} / {habits.length} 習慣完了
            </p>
          </div>
        </div>
        <p style={{ color: '#e0e7ff', fontSize: 14, marginTop: 12 }}>{encouragement}</p>
      </div>

      {/* Category cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const goal = goals[key]
          const catHabits = habits.filter(h => h.category === key)
          const catDone = catHabits.filter(h => todayCheckins[h.id]).length
          const habitPct = catHabits.length > 0 ? Math.round((catDone / catHabits.length) * 100) : null
          const milestonePct = getMilestoneProgress(goal.milestones)
          const daysLeft = getDaysRemaining(goal.deadline)

          return (
            <div key={key} style={{
              background: '#fff', borderRadius: 12,
              border: '1px solid #e5e7eb', padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: cat.text }}>{cat.label}</span>
                </div>
                {daysLeft !== null && (
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 99,
                    background: daysLeft < 30 ? '#fee2e2' : '#f3f4f6',
                    color: daysLeft < 30 ? '#b91c1c' : '#6b7280',
                  }}>残{daysLeft}日</span>
                )}
              </div>

              {goal.title
                ? <p style={{ fontSize: 12, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>{goal.title}</p>
                : <p style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic', marginBottom: 8 }}>目標未設定</p>
              }

              {goal.milestones?.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                    <span>マイルストーン</span>
                    <span>{goal.milestones.filter(m => m.done).length}/{goal.milestones.length}</span>
                  </div>
                  <ProgressBar value={milestonePct} color={cat.bar} height={6} />
                </div>
              )}

              {habitPct !== null && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
                    <span>今日の習慣</span>
                    <span>{catDone}/{catHabits.length}</span>
                  </div>
                  <ProgressBar value={habitPct} color={cat.bar} height={6} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Today's habit list */}
      {habits.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 12 }}>今日の習慣一覧</h3>
          <div>
            {habits.map((h, i) => {
              const cat = CATEGORIES[h.category]
              const done = !!todayCheckins[h.id]
              return (
                <div key={h.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 0',
                  borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: done ? '#22c55e' : '#f3f4f6',
                    color: done ? '#fff' : '#9ca3af',
                  }}>{done ? '✓' : '○'}</span>
                  <span style={{ fontSize: 16 }}>{h.emoji}</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 99, flexShrink: 0,
                    background: cat?.badgeBg, color: cat?.badgeText,
                  }}>{cat?.label}</span>
                  <span style={{
                    flex: 1, fontSize: 13,
                    color: done ? '#9ca3af' : '#374151',
                    textDecoration: done ? 'line-through' : 'none',
                  }}>{h.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
