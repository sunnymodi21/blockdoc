import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { UserSession } from 'blockstack'
import { appConfig } from './constants'
import './NavBar.css'
import FileSelect from './FileSelect'

class NavBar extends Component {
  constructor(){
    super()
    this.userSession = new UserSession({ appConfig })
  }

  render() {
    const userSession = this.userSession
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-blue fixed-top">
      <Link className="navbar-brand" to="/">BlockDoc</Link>
      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to={`/mydocuments`}>My Documents</Link>
          </li>
        </ul>
      </div>
      <FileSelect 
      userSession={userSession}
      />
      <button
        className="btn btn-secondary"
        onClick={this.props.signOut.bind(this)}
      >Sign out
      </button>
      </nav>
    )
  }
}

export default NavBar
