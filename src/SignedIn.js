import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { UserSession, getPublicKeyFromPrivate } from 'blockstack'
// import EditMe from './EditMe'
import MyDocuments from './MyDocuments'
import NavBar from './NavBar'
import Preview from './Preview'
import { appConfig } from './constants'
import './SignedIn.css'


class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.signOut = this.signOut.bind(this)
    this.addPublicKey()
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }
  
  addPublicKey() {
    const userData = this.userSession.loadUserData()
    const publicKey = getPublicKeyFromPrivate(userData.appPrivateKey)
    this.userSession.putFile('key.json', JSON.stringify(publicKey),{ encrypt: false })
  }

  render() {
    const userSession = this.userSession
    if(window.location.pathname === '/') {
      return (
        <Redirect to={`/mydocuments`} />
      )
    }

    return (
      <div className="row" style={{ paddingTop: "4rem"}}>
      <NavBar signOut={this.signOut}/>
      <Switch>
        <Route
          path={`/mydocuments`}
          render={
            routeProps => <MyDocuments
            protocol={window.location.protocol}
            userSession={userSession}
            realm={window.location.origin.split('//')[1]}
            {...routeProps} />
          }
        />
        <Route 
          path="/doc/:id/:fileCode"
          render={
            routeProps => <Preview
            protocol={window.location.protocol}
            userSession={userSession}
            realm={window.location.origin.split('//')[1]}
            {...routeProps} />
          }
        />
      </Switch>
      </div>
    );
  }
}

export default SignedIn
