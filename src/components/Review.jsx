import { useState, useEffect } from 'react'
import { CATEGORIES } from '../constants'
import { getToday, getWeekKey } from '../utils'
import ProgressBar from './ProgressBar'

const MOODS = [
  { e: '😞', l: 'つらい' },
  { e: '😕', l: 'いまいち' },
  { e: '😐', l: 'ふつう' },
  { e: '🙂', l: 'よい' },
  { e: '😄', l: '最高' },
]

export default function Review({ habits, checkins, reviews, onSaveReview }) {
  const weekKey = getWeekKey(getToday())
  const [form, setForm] = useState(reviews[weekKey] || { wins: '', challenges: '', plan: '', mood: 2 })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setForm(reviews[weekKey] || { wins: '', challenges: '', plan: '', mood: 2 })
    setSaved(false)
  }, [weekKey])

  // Past 7 days
  const weekDays = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    weekDays.push(d.toISOString().slice(0, 10))
  }

  const weekStats = habits.map(h => ({
    ...h,
    done: weekDays.filter(d => checkins[d]?.[h.id]).length,
  }))
  const weekTotal = weekStats.reduce((s, h) => s + h.done, 0)
  const weekMax = habits.length * 7
  const weekPct = weekMax > 0 ? Math.round((weekTotal / weekMax) * 100) : 0

  const handleSave = () => {
    onSaveReview(weekKey, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Week stats */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, fontSize: 15 }}>今週の成績</h3>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{weekKey}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: '#6366f1', lineHeight: 1 }}>
            {weekPct}<span style={{ fontSize: 20, color: '#a5b4fc' }}>%</span>
          </div>
          <div style={{ flex: 1 }}>
            <ProgressBar value={weekPct} />
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{weekTotal} / {weekMax} 習慣完了</p>
          </div>
        </div>

        {weekStats.length > 0 ? (
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weekStats.map(h => {
              const cat = CATEGORIES[h.category]
              const pct = Math.round((h.done / 7) * 100)
              return (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{h.emoji}</span>
                  <span style={{ flex: 1, fontSize: 13, color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', width: 28, textAlign: 'right' }}>{h.done}/7</span>
                  <div style={{ width: 64, background: '#e5e7eb', borderRadius: 99, height: 6 }}>
                    <div style={{ height: 6, borderRadius: 99, background: cat?.bar, width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
            習慣タブで習慣を登録しましょう
          </p>
        )}
      </div>

      {/* Review form */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20 }}>
        <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}>週次振り返り</h3>

        {/* Mood */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>今週の気分</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {MOODS.map((m, i) => (
              <button
                key={i}
                onClick={() => setForm(f => ({ ...f, mood: i }))}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 2, padding: '6px 10px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: form.mood === i ? '#eef2ff' : 'transparent',
                  transform: form.mood === i ? 'scale(1.15)' : 'scale(1)',
                  opacity: form.mood === i ? 1 : 0.45,
                  transition: 'all .2s',
                }}
              >
                <span style={{ fontSize: 22 }}>{m.e}</span>
                <span style={{ fontSize: 10, color: '#6b7280' }}>{m.l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text areas */}
        {[
          { key: 'wins', label: '今週の成果・よかったこと', placeholder: '達成したこと、気づき、嬉しかったこと...' },
          { key: 'challenges', label: '課題・うまくいかなかったこと', placeholder: '障害になったこと、改善したいこと...' },
          { key: 'plan', label: '来週の計画・改善アクション', placeholder: '来週に集中すること、具体的な行動計画...' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>{label}</label>
            <textarea
              rows={3}
              placeholder={placeholder}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={{
                width: '100%', border: '1px solid #d1d5db', borderRadius: 8,
                padding: '8px 12px', fontSize: 13, resize: 'none', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: 'none',
            fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            background: saved ? '#22c55e' : '#6366f1',
            color: '#fff', transition: 'background .3s',
          }}
        >
          {saved ? '✓ 保存しました！' : '振り返りを保存'}
        </button>
      </div>
    </div>
  )
}
