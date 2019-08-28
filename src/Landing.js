import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import { appConfig } from './constants'
import './Landing.css'

class Landing extends Component {

  constructor() {
    super()
    this.userSession = new UserSession({ appConfig })
  }

  signIn(e) {
    e.preventDefault()
    this.userSession.redirectToSignIn()
  }

  render() {
    return (
      <div className="masthead d-flex">
        <div className="container text-center my-auto">
          <h1 className="mb-1 text-white">Blockdoc</h1>
          <h4 className="mb-4 text-white">
            <em>Decentralized secure documents manager with private sharing</em>
          </h4>
          <button
              className="btn btn-lg btn-primary"
              onClick={this.signIn.bind(this)}>Sign in with Blockstack
            </button>
        </div>
        <div className="overlay"></div>
      </div>
    );
  }
}

export default Landing
