import React, { Component } from 'react'

import './Login.css'

import { createAuthApi } from '../lib/authApi'

export class Login extends Component {

  state = {
    email: '',
    password: '',
    error: false
  }

  login = createAuthApi(fetch).login

  handleEmailChange = e => {
    e.persist()
    e.preventDefault()

    this.setState(state => ({
      email: e.target.value
    }))
  }
  
  handlePasswordChange = e => {
    e.persist()
    e.preventDefault()

    this.setState(state => ({
      password: e.target.value
    }))
  }

  handleSubmit = e => {
    e.persist()
    e.preventDefault()

    this.login(this.state.email, this.state.password)
    .then(({ status, token, body }) => {
      localStorage.apiToken = token
      this.props.history.push(`/`)
    })
    .catch(error => 
      this.setState(state => ({ error }))
    )
  }

  render() {
    return (
      <div className="Login container">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="login-panel panel panel-default">
              
              <div className="panel-heading">
                <h3 className="panel-title">
                  Please sign in
                </h3>
              </div>

              <div className="panel-body">
                <form role="form" onSubmit={this.handleSubmit}>
                  <fieldset>
                    <div className="form-group">
                      <label htmlFor="usernameInput">Username</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="usernameInput" 
                        placeholder="Username" 
                        onChange={this.handleEmailChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="passwordInput">Password</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="passwordInput" 
                        placeholder="Password" 
                        onChange={this.handlePasswordChange}
                      />
                    </div>
                    
                    <button type="submit" className="btn btn-default">Submit</button>
                  
                  </fieldset>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}