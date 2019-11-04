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
      <div>
        <header className="masthead text-white text-center">
        {/* <div className="masthead d-flex">
          <a style={{paddingTop:'300px', position:"absolute"}} href="https://www.producthunt.com/posts/blockdoc?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-blockdoc" rel="noopener noreferrer" target="_blank">
            <img alt="ProductHunt" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=166321&theme=dark"
            style={{width: '250px', height: '54px'}} width="250px" height="54px" />
          </a>
        </div> */}
          <div className="overlay"></div>
          <div className="container">
            <div className="row">
            <div className="col-xl-9 mx-auto">
                <h1 className="mb-5">BlockDoc</h1>
              </div>
              <div className="col-xl-9 mx-auto">
                <h1 className="mb-5">Decentralized secure documents manager with private sharing</h1>
              </div>
              <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
                <button
                  className="btn btn-lg btn-primary"
                  onClick={this.signIn.bind(this)}>Sign in/Sign Up with Blockstack
                </button>
              </div>
            </div>
          </div>
        </header>

    <section className="features-icons bg-dark text-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
              <div className="features-icons-icon d-flex">
                <i className="fa fa-key m-auto text-white"></i>
              </div>
              <h3 className="text-white">Encrypted</h3>
              <p className="text-white mb-0">Built-in end-to-end encryption</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
              <div className="features-icons-icon d-flex">
                <i className="fa fa-database m-auto text-white"></i>
              </div>
              <h3 className="text-white">Decentralized</h3>
              <p className="text-white mb-0">All the data is stored in secure decentralized storage</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="features-icons-item mx-auto mb--lg-0 mb-lg-3">
              <div className="features-icons-icon d-flex">
                <i className="fa fa-lock m-auto text-white"></i>
              </div>
              <h3 className="text-white">Privacy</h3>
              <p className="text-white mb-0">Doesn't allow Unauthorized access and guarantees that only you have access to them</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <section className="showcase">
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-6 order-lg-2 text-white showcase-img border border-secondary" style={{backgroundImage: "url('img/showcase-1.jpg')"}}></div>
          <div className="col-lg-6 order-lg-1 my-auto showcase-text">
            <h2>Manage and Preview documents</h2>
            <p className="lead mb-0">Manange and view the documents</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 text-white showcase-img border border-secondary" style={{backgroundImage: "url('img/showcase-2.jpg')"}}></div>
          <div className="col-lg-6 my-auto showcase-text">
            <h2>Share files privately</h2>
            <p className="lead mb-0">Share data with other users</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 order-lg-2 text-white showcase-img border border-secondary" style={{backgroundImage: "url('img/showcase-3.jpg')"}}></div>
          <div className="col-lg-6 order-lg-1 my-auto showcase-text">
            <h2>Edit images through the app</h2>
            <p className="lead mb-0">Directly edit images inside the app</p>
          </div>
        </div>
      </div>
    </section>
    <section className="call-to-action text-white text-center">
      <div className="overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-xl-9 mx-auto">
            <h2 className="mb-4">Ready to get started? Sign up/Sign in now!</h2>
          </div>
          <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
          <button
            className="btn btn-lg btn-primary"
            onClick={this.signIn.bind(this)}>Sign in/Sign Up with Blockstack
          </button>
          </div>
        </div>
      </div>
    </section>
  
    <footer className="footer bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 h-100 text-center text-lg-left my-auto">
            <p className="text-muted small mb-4 mb-lg-0">&copy; BlockDoc 2019. All Rights Reserved.</p>
          </div>
          <div className="col-lg-6 h-100 text-center text-lg-right my-auto">
            <ul className="list-inline mb-0">
              <li className="list-inline-item mr-3">
                <a href="https://twitter.com/BlockDocApp" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-twitter-square fa-2x fa-fw"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
      </div>
    );
  }
}

export default Landing
