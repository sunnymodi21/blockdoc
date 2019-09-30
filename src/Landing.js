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
              onClick={this.signIn.bind(this)}>Sign in/Sign Up with Blockstack
            </button>
        </div>
        <a style={{paddingTop:'300px', position:"absolute"}} href="https://www.producthunt.com/posts/blockdoc?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-blockdoc" rel="noopener noreferrer" target="_blank">
          <img alt="ProductHunt" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=166321&theme=dark"
          style={{width: '250px', height: '54px'}} width="250px" height="54px" />
        </a>
      </div>
    );
  }
}

export default Landing
