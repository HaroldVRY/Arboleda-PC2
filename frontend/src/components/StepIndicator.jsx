import React from 'react'

export default function StepIndicator({ steps, current }) {
  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const num = i + 1
        const isDone = num < current
        const isActive = num === current
        return (
          <React.Fragment key={num}>
            <div className={`step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}>
              <div className="dot">{isDone ? '✓' : num}</div>
            </div>
            {i < steps.length - 1 && (
              <div className={`step${isDone ? ' done' : ''}`} style={{ flex: 1 }}>
                <div className="line" />
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
