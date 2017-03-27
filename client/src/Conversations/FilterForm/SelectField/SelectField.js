import React from 'react'

export const SelectField = props => {
  
  const options = props.options.map(opt => <option value={opt.value} key={opt.value}>{opt.text}</option> )

  return (
    <div className="SelectField">
      <label htmlFor={props.name} className="SelectLabel">{props.label}</label>
      <select 
        name={props.name} 
        id={props.name}
        onChange={props.handleChange}
        defaultValue={props.defaultValue}
      >
        {options}
      </select>
    </div>
  )
}

SelectField.PropTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.number,
    text: React.PropTypes.string
  })).isRequired,
  name: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  handleChange: React.PropTypes.func.isRequired,
  defaultValue: React.PropTypes.string
}