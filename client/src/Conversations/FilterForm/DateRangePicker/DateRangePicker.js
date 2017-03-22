import React from 'react'

export const DateRangePicker = props => {

  const minStartDate = props.minStartDate || undefined
  const maxEndDate = props.maxEndDate || undefined
  const defaultStartValue = props.defaultStartValue || props.minStartDate || undefined
  const defaultEndValue = props.defaultEndValue || props.maxEndDate || undefined

  const maxStartDate = props.defaultEndValue || props.maxEndDate || undefined
  const minEndDate = props.defaultStartValue || props.minStartDate || undefined
  

  return (
    <div className="DateRangePicker">
      <label htmlFor="from" className="DatePickerLabel">Date between:</label>
      <input type="date" id="from" className="DateInput" 
        min={minStartDate}
        max={maxStartDate}
        onInput={props.handleStartInput}
        defaultValue={defaultStartValue}
      />
      <label htmlFor="to" className="DatePickerLabel">and</label>
      <input type="date" id="to" className="DateInput" 
        min={minEndDate}
        max={maxEndDate}
        onInput={props.handleEndInput}
        defaultValue={defaultEndValue}
      />
    </div>
  )
}

DateRangePicker.PropTypes = {
  minStartDate: React.PropTypes.string,
  maxEndDate: React.PropTypes.string,
  defaultStartValue: React.PropTypes.string,
  defaultEndValue: React.PropTypes.string,
  handleStartInput: React.PropTypes.func.isRequired,
  handleEndInput: React.PropTypes.func.isRequired
}