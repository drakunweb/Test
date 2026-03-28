import { useState } from 'react'
import { CATEGORIES } from '../constants'
import { getDaysRemaining, getMilestoneProgress } from '../utils'
import ProgressBar from './ProgressBar'

function GoalEditor({ catKey, goal, onUpdate }) {
  const cat = CATEGORIES[catKey]
  const [newMilestone, setNewMilestone] = useState('')
  const progress = getMilestoneProgress(goal.milestones)
  const daysLeft = getDaysRemaining(goal.deadline)

  const addMilestone = () => {
    const text = newMilestone.trim()
    if (!text) return
    onUpdate(catKey, {
      ...goal,
      milestones: [...(goal.milestones || []), { id: Date.now().toString(), text, done: false }],
    })
    setNewMilestone('')
  }

  const toggleMilestone = (id) => {
    onUpdate(catKey, {
      ...goal,
      milestones: goal.milestones.map(m => m.id === id ? { ...m, done: !m.done } : m),
    })
  }

  const removeMilestone = (id) => {
    onUpdate(catKey, { ...goal, milestones: goal.milestones.filter(m => m.id !== id) })
  }

  return (
    <div style={{
      background: cat.lightBg,
      border: `2px solid ${cat.lightBorder}`,
      borderRadius: 12, padding: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{cat.icon}</span>
          <span style={{ fontWeight: 700, color: cat.text }}>{cat.label}</span>
        </div>
        {daysLeft !== null && (
          <span style={{
            fontSize: 12, padding: '4px 10px', borderRadius: 99, fontWeight: 600,
            background: daysLeft < 0 ? '#fee2e2' : daysLeft < 30 ? '#ffedd5' : '#f3f4f6',
            color: daysLeft < 0 ? '#b91c1c' : daysLeft < 30 ? '#c2410c' : '#6b7280',
          }}>
            {daysLeft < 0 ? `${-daysLeft}日超過` : `残${daysLeft}日`}
          </span>
        )}
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 12, color: '#6b7280' }}>
          長期目標
          <input
            type="text"
            placeholder="例: 体重を5kg減らす / TOEIC 900点取得"
            value={goal.title || ''}
            onChange={e => onUpdate(catKey, { ...goal, title: e.target.value })}
            style={inputStyle}
          />
        </label>
        <label style={{ fontSize: 12, color: '#6b7280' }}>
          動機・詳細（なぜ達成したいか）
          <textarea
            rows={2}
            placeholder="達成することで何が変わるか、なぜ重要か..."
            value={goal.description || ''}
            onChange={e => onUpdate(catKey, { ...goal, description: e.target.value })}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </label>
        <label style={{ fontSize: 12, color: '#6b7280' }}>
          達成期限
          <input
            type="date"
            value={goal.deadline || ''}
            onChange={e => onUpdate(catKey, { ...goal, deadline: e.target.value })}
            style={{ ...inputStyle, width: 'auto' }}
          />
        </label>
      </div>

      {/* Milestones */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>マイルストーン（中間目標）</span>
          {goal.milestones?.length > 0 && (
            <span style={{ fontSize: 11, color: '#9ca3af' }}>{progress}% 達成</span>
          )}
        </div>

        {goal.milestones?.length > 0 && (
          <>
            <ProgressBar value={progress} color={cat.bar} />
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {goal.milestones.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() => toggleMilestone(m.id)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                  <span style={{
                    flex: 1, fontSize: 13,
                    color: m.done ? '#9ca3af' : '#374151',
                    textDecoration: m.done ? 'line-through' : 'none',
                  }}>{m.text}</span>
                  <button
                    onClick={() => removeMilestone(m.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', fontSize: 12, padding: 2 }}
                    onMouseOver={e => e.target.style.color = '#ef4444'}
                    onMouseOut={e => e.target.style.color = '#d1d5db'}
                  >✕</button>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            type="text"
            placeholder="マイルストーンを追加（Enterで確定）"
            value={newMilestone}
            onChange={e => setNewMilestone(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMilestone()}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button onClick={addMilestone} style={btnPrimary}>追加</button>
        </div>
      </div>
    </div>
  )
}

export default function Goals({ goals, onUpdate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#eef2ff', border: '1px solid #c7d2fe',
        borderRadius: 12, padding: 14, fontSize: 13, color: '#4338ca',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>目標設定のポイント</p>
        <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12 }}>
          <li>具体的・測定可能な目標を設定する（SMARTゴール）</li>
          <li>マイルストーンで大きな目標を分解する</li>
          <li>「なぜ達成したいか」を明確に書く（動機の言語化）</li>
        </ul>
      </div>
      {Object.keys(CATEGORIES).map(key => (
        <GoalEditor key={key} catKey={key} goal={goals[key]} onUpdate={onUpdate} />
      ))}
    </div>
  )
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  border: '1px solid #d1d5db',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  outline: 'none',
  background: '#fff',
  fontFamily: 'inherit',
}

const btnPrimary = {
  background: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}
