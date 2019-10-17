import React, { Component } from 'react'
import { encryptECIES } from 'blockstack/lib/encryption'
import AsyncSelect from 'react-select/async'
import sh from 'shorthash'
import './Modal.css'

class ShareModal extends Component {
  constructor(props){
    super(props)
    this.shareDocument = this.shareDocument.bind(this)
    this.copyLink = this.copyLink.bind(this)
    this.userSession = this.props.userSession
    this.userData = this.props.userSession.loadUserData()
    this.state = {
      username: '',
      link: '',
      copied: false,
      nonUser: false 
    }
    this.documents = this.props.documents
    this.file = this.props.fileDetails
    this.promiseOptions = this.promiseOptions.bind(this)
    this.onFriendSelect = this.onFriendSelect.bind(this)
  }

  shareDocument(){
    const username = this.username
    const shareSet = new Set(this.file.shareList)
    const hash = sh.unique(this.file.fileId+username)
    const link = `${window.location.origin}/doc/${this.userData.username}/${hash}`
    if(shareSet.has(username)){
      this.setState({
        link
      })
    } else {
      this.userSession.getFile('key.json', {
        username: this.username,
        decrypt: false
      }).then(publicKey => {
        if(publicKey !== null){
          const file = {...this.file}
          const encryptedData = encryptECIES(publicKey, JSON.stringify(file))
          this.userSession.putFile(`filedetails/${hash}`, JSON.stringify(encryptedData), { encrypt: false })
          this.documents.find((document)=>{
            if(document.fileId===this.file.fileId){
              shareSet.add(username)
              document.shareList = [...shareSet]
              return true
            } else {
              return false
            }
          })
          this.userSession.putFile('documents/index.json', JSON.stringify(this.documents)).then(()=>{
            this.setState({
              link
            })
          })
        } else{
          this.setState({
            nonUser: true
          })
          
        }
      })
      .catch(()=>{
        this.setState({
          nonUser: true
        })
      }) 
    }
  }
  
  promiseOptions(inputValue){
    return fetch(`https://core.blockstack.org/v1/search?query=${encodeURIComponent(inputValue)}`)
    .then(response => response.json().then((data)=> {
      return (data.results.map((value) => ({label:value.username, value: value})))
    }))
  }

  onFriendSelect(selectedFriend){
    this.setState({
      nonUser: false,
      copied: false,
      link: ''
    })
    this.username = selectedFriend.value.fullyQualifiedName
  }

  copyLink(){
    this.setState({
      copied: true
    })
    navigator.clipboard.writeText(this.state.link)
  }

  render() {
    return (

      <div className="modal" style={{display: "block"}}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="float-right">              
              <button type="button" className="close p-2" onClick={this.props.handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          <div className="modal-body">
            <form>
              <div className="form-group row">
                <label htmlFor="file-name" className="col-form-label pl-2">Share with:</label>
                <div className="col-sm-10">     
                  <AsyncSelect
                      cacheOptions
                      loadOptions={this.promiseOptions}
                      onChange = {this.onFriendSelect}
                  />
                </div>
                <small className="form-text text-muted col-sm-12">Search Blockstack users</small>
              </div>
            {this.state.link!==''? 
              <div className="form-group row">
                <div className="input-group col-sm-12">
                  <input type="text" value={this.state.link} className="form-control" readOnly></input>
                  <div className="input-group-append border border-secondary rounded">
                    <div onClick={this.copyLink} className="input-group-btn">
                      <button type="button" className="btn btn-default">
                        <i className="fa fa-copy"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <small className="form-text text-muted col-sm-12">Share this URL with the user</small>
              </div>:''}
            {this.state.copied?<div className="alert alert-success col-sm-12" role="alert">
              Copied!
            </div>: ''}
            {this.state.nonUser?<div className="alert alert-danger col-sm-10" role="alert">
              User hasn't signed up on BlockDoc
            </div>: ''}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={this.shareDocument}>Share</button>
          </div>
        </div>
      </div>
  </div>
    );
  }
}

export default ShareModal

