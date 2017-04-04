import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'

import './Login.css'

import { createAuthApi } from '../lib/authApi'

export class Login extends Component {

  state = {
    username: '',
    password: '',
    error: false,
    alertVisible: false
  }

  login = createAuthApi(fetch).login

  handleUsernameChange = e => {
    e.persist()
    e.preventDefault()

    this.setState(state => ({
      username: e.target.value
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

    this.login(this.state.username, this.state.password)
    .then(({ status, token, body }) => {
      localStorage.apiToken = token
      localStorage.username = body.username
      localStorage.email = body.email

      let redirectTo = this.props.location
      while(redirectTo.state) {
        redirectTo = redirectTo.state.from
      }
      redirectTo = redirectTo.pathname

      this.props.history.push(redirectTo === '/login' || redirectTo === '/login/' ? '/' : redirectTo)
    })
    .catch(error => {
      console.error(error)
      this.setState(state => ({ error, alertVisible: true }))
    })
  }

  handleErrorDismiss = e => {
    e.persist()
    e.preventDefault()

    this.setState(state => ({
      alertVisible: false
    }))
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
                        onChange={this.handleUsernameChange}
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

        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            {
              this.state.alertVisible ? 
              <Alert bsStyle="danger" onDismiss={this.handleErrorDismiss}>
                <h4>{this.state.error.error || this.state.error.toString()}</h4>
              </Alert>
              :
              ''
            }
          </div>
        </div>
      </div>
    )
  }
}