import React from 'react'

import './FilterForm.css'

import { SearchField as ParticipantSearch } from './SearchField'
import { DateRangePicker } from './DateRangePicker'
import { SelectField as LabelSelector, SelectField as ErrorSelector } from './SelectField'

export const FilterForm = props => (
  <div className="FilterForm">
    <form className="container-fluid">
      <div className="row">
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <ParticipantSearch 
            options={[]}
            handleInput={() => {}}
          />
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <DateRangePicker 
            minStartDate="2017-03-22"
            maxEndDate="2017-03-31"
            handleStartInput={() => {}}
            handleEndInput={() => {}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <LabelSelector 
            name="clusterLabelSelector"
            label="Label:"
            options={[{
              value: 1,
              text: 'text'
            }]}
            handleChange={() => {}}
          />
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 text-center">
          <ErrorSelector 
            name="errorSelector"
            label="Error:"
            options={[{
              value: 1,
              text: 'text'
            }]}
            handleChange={() => {}}
          />
        </div>  
      </div>
      
    </form>

  </div>
)

FilterForm.PropTypes = {
  participantList: React.PropTypes.array.isRequired,
  handleParticipantInput: React.PropTypes.func.isRequired,
  minStartDate: React.PropTypes.string,
  maxEndDate: React.PropTypes.string,
  handleStartInput: React.PropTypes.func.isRequired,
  handleEndInput: React.PropTypes.func.isRequired,
  labelOptions: React.PropTypes.array.isRequired,
  handleLabelChange: React.PropTypes.func.isRequired,
  errorOptions: React.PropTypes.array.isRequired,
  handleErrorChange: React.PropTypes.func.isRequired
}