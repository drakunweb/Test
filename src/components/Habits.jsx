import { useState, useMemo } from 'react'
import { CATEGORIES, HABIT_EMOJIS } from '../constants'
import { getToday, getStreak } from '../utils'

function HabitCalendar({ habitId, checkins }) {
  const today = new Date()
  const days = []
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({ key, done: !!checkins[key]?.[habitId], isToday: i === 0 })
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 6 }}>
      {days.map(d => (
        <div
          key={d.key}
          title={d.key}
          style={{
            width: 14, height: 14, borderRadius: 3,
            background: d.done ? '#6366f1' : d.isToday ? '#d1d5db' : '#e5e7eb',
            outline: d.isToday ? '2px solid #818cf8' : 'none',
            outlineOffset: 1,
            transition: 'background .2s',
          }}
        />
      ))}
    </div>
  )
}

export default function Habits({ habits, checkins, onToggle, onAdd, onRemove }) {
  const today = getToday()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'health', emoji: '🎯' })

  const handleAdd = () => {
    if (!form.name.trim()) return
    onAdd({ ...form, name: form.name.trim(), id: Date.now().toString() })
    setForm({ name: '', category: 'health', emoji: '🎯' })
    setShowForm(false)
  }

  const grouped = useMemo(() =>
    Object.keys(CATEGORIES).reduce((acc, k) => {
      acc[k] = habits.filter(h => h.category === k)
      return acc
    }, {}),
    [habits]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 13, color: '#6b7280' }}>毎日の行動を記録し、継続の力を積み上げましょう。</p>
        <button
          onClick={() => setShowForm(s => !s)}
          style={{
            background: '#6366f1', color: '#fff', border: 'none',
            borderRadius: 8, padding: '8px 14px', fontSize: 13,
            cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
          }}
        >＋ 習慣を追加</button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background: '#eef2ff', border: '1px solid #c7d2fe',
          borderRadius: 12, padding: 16,
        }}>
          <p style={{ fontWeight: 600, color: '#4338ca', fontSize: 13, marginBottom: 12 }}>新しい習慣</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <select
              value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '8px', fontSize: 16, background: '#fff' }}
            >
              {HABIT_EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <input
              autoFocus
              type="text"
              placeholder="習慣名（例: 30分ウォーキング）"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{
                flex: 1, border: '1px solid #d1d5db', borderRadius: 8,
                padding: '8px 12px', fontSize: 13, outline: 'none',
                background: '#fff', fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setForm(f => ({ ...f, category: key }))}
                style={{
                  border: 'none', borderRadius: 99, padding: '4px 12px',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                  background: form.category === key ? cat.bar : cat.lightBg,
                  color: form.category === key ? '#fff' : cat.text,
                  outline: form.category === key ? 'none' : `1px solid ${cat.lightBorder}`,
                }}
              >{cat.icon} {cat.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleAdd} style={{
              background: '#6366f1', color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}>追加</button>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none', border: 'none', color: '#6b7280',
              fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}>キャンセル</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {habits.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🌱</p>
          <p style={{ fontWeight: 600 }}>習慣がまだ登録されていません</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>「習慣を追加」から始めましょう</p>
        </div>
      )}

      {/* Habit list by category */}
      {Object.entries(CATEGORIES).map(([catKey, cat]) => {
        const catHabits = grouped[catKey]
        if (!catHabits.length) return null
        return (
          <div key={catKey} style={{
            background: '#fff', borderRadius: 12,
            border: '1px solid #e5e7eb', padding: 16,
          }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: cat.text, marginBottom: 16 }}>
              {cat.icon} {cat.label}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {catHabits.map(h => {
                const done = !!checkins[today]?.[h.id]
                const streak = getStreak(h.id, checkins)
                return (
                  <div key={h.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        onClick={() => onToggle(h.id)}
                        style={{
                          width: 30, height: 30, borderRadius: '50%',
                          border: done ? 'none' : '2px solid #d1d5db',
                          background: done ? '#6366f1' : 'transparent',
                          color: done ? '#fff' : '#d1d5db',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer',
                          flexShrink: 0, transition: 'all .2s',
                        }}
                      >{done ? '✓' : ''}</button>
                      <span style={{ fontSize: 18 }}>{h.emoji}</span>
                      <span style={{
                        flex: 1, fontSize: 13, fontWeight: 500,
                        color: done ? '#9ca3af' : '#374151',
                        textDecoration: done ? 'line-through' : 'none',
                      }}>{h.name}</span>
                      {streak > 1 && (
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 99,
                          background: '#fff7ed', color: '#c2410c',
                        }}>🔥 {streak}日</span>
                      )}
                      {streak === 1 && (
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 99,
                          background: '#fefce8', color: '#a16207',
                        }}>✨ 継続中</span>
                      )}
                      <button
                        onClick={() => onRemove(h.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#d1d5db', fontSize: 12, padding: 2,
                        }}
                        onMouseOver={e => e.target.style.color = '#ef4444'}
                        onMouseOut={e => e.target.style.color = '#d1d5db'}
                      >✕</button>
                    </div>
                    <div style={{ marginLeft: 40 }}>
                      <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>過去35日間の記録</p>
                      <HabitCalendar habitId={h.id} checkins={checkins} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
