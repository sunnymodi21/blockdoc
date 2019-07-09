import React, { Component } from 'react'

class EditMe extends Component {
  constructor(props){
    super(props)
    this.resetAccount = this.resetAccount.bind(this)
    this.userSession = this.props.userSession
  }
  resetAccount(){
    this.userSession.deleteFile('documents/')
    this.userSession.deleteFile('documents/index.json')
  }
  render() {

    return (
      <div>
        <h2>Setting</h2>
        <div>
        <button
            className="btn btn-outline-danger"
            onClick={this.resetAccount}>Reset Account
          </button>
        </div>
      </div>
    );
  }
}


export default EditMe
