export default function ProgressBar({ value, color = '#6366f1', height = 8 }) {
  return (
    <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 99, height }}>
      <div
        style={{
          height,
          borderRadius: 99,
          background: color,
          width: `${Math.min(100, Math.max(0, value))}%`,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  )
}
