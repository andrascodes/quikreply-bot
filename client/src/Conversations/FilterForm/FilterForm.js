import React from 'react'

import './FilterForm.css'

import { SearchField as ParticipantSearch } from './SearchField'
import { DateRangePicker } from './DateRangePicker'
import { SelectField as LabelSelector, SelectField as ErrorSelector } from './SelectField'

export const FilterForm = props => (
  <div className="FilterForm">
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <ParticipantSearch 
            options={props.participantList}
            handleInput={props.handleParticipantInput}
            defaultParticipantValue={props.defaultParticipantValue}
          />
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <DateRangePicker 
            minStartDate={props.minStartDate}
            maxEndDate={props.maxEndDate}
            defaultStartValue={props.defaultStartValue}
            defaultEndValue={props.defaultEndValue}
            handleStartInput={props.handleStartInput}
            handleEndInput={props.handleEndInput}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <LabelSelector 
            name="clusterLabelSelector"
            label="Label:"
            options={props.labelOptions}
            handleChange={props.handleLabelChange}
            defaultValue={props.defaultLabelValue}
          />
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <ErrorSelector 
            name="errorSelector"
            label="Error:"
            options={props.errorOptions}
            handleChange={props.handleErrorChange}
            defaultValue={props.defaultErrorValue}
          />
        </div>  
      </div>
      
    </div>

  </div>
)

FilterForm.PropTypes = {
  participantList: React.PropTypes.array.isRequired,
  handleParticipantInput: React.PropTypes.func.isRequired,
  defaultParticipantValue: React.PropTypes.string,

  minStartDate: React.PropTypes.string,
  maxEndDate: React.PropTypes.string,
  defaultStartValue: React.PropTypes.string,
  defaultEndValue: React.PropTypes.string,
  handleStartInput: React.PropTypes.func.isRequired,
  handleEndInput: React.PropTypes.func.isRequired,

  labelOptions: React.PropTypes.array.isRequired,
  handleLabelChange: React.PropTypes.func.isRequired,
  defaultLabelValue: React.PropTypes.string,

  errorOptions: React.PropTypes.array.isRequired,
  handleErrorChange: React.PropTypes.func.isRequired,
  defaultErrorValue: React.PropTypes.string,
}