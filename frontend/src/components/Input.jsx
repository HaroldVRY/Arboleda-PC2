import React from 'react'

export default function Input({ label, error, id, ...props }) {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} className={`input${error ? ' error' : ''}`} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
