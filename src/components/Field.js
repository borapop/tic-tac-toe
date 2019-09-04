import React from 'react'
import './Field.css';
import x from './x.svg'
import o from './o.svg'

export const FIELD_SOURCES = [x, o]

function Field({ value, onClick, whoMovesIndex }) {
  const pristine = value === null
  return <div onClick={onClick} className="field">
    <img
      src={pristine ? FIELD_SOURCES[whoMovesIndex] : FIELD_SOURCES[value]}
      className={`field__value ${pristine ? 'field__value--pristine' : ''}`}
      alt="field"
    />
  </div>
}

function areEqual(prevProps, nextProps) {
  return false
}

export default React.memo(Field, (areEqual));