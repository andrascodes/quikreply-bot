import React from 'react'

export const SearchField = props => {
  
  const listOptions = props.options.map(person => <option key={person} value={person} />)

  return (
    <div className="form-group SearchField">
      <label htmlFor="participants" className="SearchLabel">Participant:</label>
      <input list="participants" className="SearchInput" 
        onInput={props.handleInput} 
        defaultValue={props.defaultValue}
      />
      <datalist id="participants">
        {listOptions}
      </datalist>
    </div>
  )
}

SearchField.propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  handleInput: React.PropTypes.func.isRequired,
  defaultValue: React.PropTypes.string
}