import React, { Component } from 'react'
import { decryptContent } from 'blockstack'
import { Redirect } from 'react-router-dom'
import PreviewModal from './PreviewModal'
import Spinner from './Spinner'

class Preview extends Component {
  constructor(props){
    super(props)
    this.userSession = this.props.userSession
    this.userData = this.props.userSession.loadUserData()
    this.state = {
      showPreviewModal: false,
      loader: true
    }
    this.file = {}
    this.getDocument = this.getDocument.bind(this)
    this.onHidePreview = this.onHidePreview.bind(this)
  }

  componentDidMount(){
    const { id, fileCode } = this.props.match.params
    this.userSession.getFile(`filedetails/${fileCode}`, { decrypt: false, username: id }).then((data)=>{
        let decryptedContent = ''
        if(data===null){
          alert('You do not have access to this file')
        } else{
            try{
              decryptedContent = decryptContent(data, { privateKey: this.userData.appPrivateKey })          
              this.file = JSON.parse(decryptedContent)
              this.getDocument(this.file, id, false)
            } 
            catch{
              this.onHidePreview()
            }
        }
    })
    .catch(()=>{
      alert('Invalid URL')
      this.onHidePreview()
    })
  }

  getDocument(currentDocument, username, isDownload){
    this.userSession.getFile('documents/'+currentDocument.fileId, { decrypt: false, username })
    .then((data)=> {
      if(data != null){
        data = decryptContent(data, { privateKey: currentDocument.aesKey })   
        if(isDownload){
          this.downloadFile(currentDocument, data)
          this.setState({
            loader: false
          })
        } else {
          this.file = currentDocument
          this.file.data = data
          this.setState({
            loader: false,
            showPreviewModal: true
          })
        }
      }
    })
  }

  downloadFile(currentDocument,data){
    var a = document.createElement('a')
    const blob = new Blob([data], {type: "octet/stream"}),
    url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = currentDocument.name+'.'+currentDocument.extension
    a.click()
    window.URL.revokeObjectURL(url)
  }

  onHidePreview(){
    this.props.history.push('/mydocuments')
  }

  render() {
    if(this.file!=={}){
        return (
            <div className="col-md">
              {this.state.loader? <Spinner/>:''}
              <PreviewModal fileDetails={this.file} handleClose={this.onHidePreview}/>   
            </div>
        )
    } else {
        return <Redirect to='/mydocuments' />
    }
  }
}

export default Preview
