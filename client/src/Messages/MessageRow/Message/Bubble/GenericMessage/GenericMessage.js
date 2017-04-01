import React, { Component } from 'react'

import { GenericElement } from './GenericElement'

import './GenericMessage.css'

export class GenericMessage extends Component {
  state = {
    index: 0,
    elements: this.props.attachment.payload.elements
  }

  incrementIndex = e => {
    e.persist()
    e.preventDefault()
    if(this.state.index < this.state.elements.length - 1) {
      this.setState(state => ({
        index: state.index + 1
      }))
    }
  }

  decrementIndex = e => {
    e.persist()
    e.preventDefault()
    if(this.state.index > 0) {
      this.setState(state => ({
        index: state.index - 1
      }))
    }
  }

  render() {
    return (
      <div className="GenericMessage row">
        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-left">
          <button 
            className={`GenericPagingButton btn ${this.state.index <= 0 ? 'disabled' : ''}`}
            onClick={this.decrementIndex}
          >
            <i className="fa fa-chevron-left" />
          </button>
        </div>
        
        <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-center">
          <GenericElement 
            index={this.state.index} 
            element={this.state.elements[this.state.index]} 
          />
        </div>
        
        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-right">
          <button 
            className={`GenericPagingButton btn ${this.state.index === this.state.elements.length - 1 ? 'disabled' : ''}`} 
            onClick={this.incrementIndex} 
          >
            <i className="fa fa-chevron-right" />
          </button>
        </div>
      </div>
    )
  }
}