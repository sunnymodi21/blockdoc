import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { UserSession } from 'blockstack'
import EditMe from './EditMe'
import MyDocuments from './MyDocuments'
import NavBar from './NavBar'
import { appConfig } from './constants'
import './SignedIn.css'


class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.signOut = this.signOut.bind(this)
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }

  render() {
    const username = this.userSession.loadUserData().username
    const userSession = this.userSession
    if(window.location.pathname === '/') {
      return (
        <Redirect to={`/mydocuments`} />
      )
    }

    return (
      <div className="SignedIn">
      <NavBar username={username} signOut={this.signOut}/>
      <Switch>
              <Route
                path='/me'
                render={
                  routeProps => <EditMe
                  username={username}
                  userSession={userSession}
                  {...routeProps} />
                }
              />
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
      </Switch>
      </div>
    );
  }
}

export default SignedIn
