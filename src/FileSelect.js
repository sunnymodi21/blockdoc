import React, { Component } from 'react'
import { makeECPrivateKey, getPublicKeyFromPrivate } from 'blockstack'
import Spinner from './Spinner'
const bytes = ['Bytes','KB', 'MB']

class FileSelect extends Component {
  constructor(props){
    super(props)
    this.state = {
      uploading: false
    }
    this.userSession = this.props.userSession
  }

  uploadDocument(){
    this.setState({
      uploading: true
    })
    let documents = this.documents
    this.file.aesKey =  makeECPrivateKey()
    documents.push(this.file)
    this.userSession.putFile('documents/index.json', JSON.stringify(documents))
    this.userSession.putFile(`documents/${this.file.fileId}`, this.data, {encrypt: getPublicKeyFromPrivate(this.file.aesKey)})
    .then((res)=>{
      this.props.updateDocumentList(documents)
      this.setState({
        uploading: false
      })
    })
  }

  onFileSelect(e){
    const file =  e.target.files[0]
    if (file!==undefined && /\.(jpe?g|png|pdf|docx?)$/i.test(file.name)) {
      const reader  = new FileReader()
      reader.onload= (e)=>{
        this.data = e.target.result
        let imgFileSize = this.data.byteLength
        if(imgFileSize<25000000){
          const fileObj = {}    
          const date = new Date()
          fileObj.date = date
          const timestamp = date.getTime()
          fileObj.fileId = timestamp
          let count = 0
          while(imgFileSize>1000){
            imgFileSize = imgFileSize/1000
            count +=1
          }
          fileObj.size = Math.floor(imgFileSize).toString()+' '+bytes[count]
          const fileNameArray = file.name.split(".")
          
          fileObj.name = fileNameArray.slice(0,fileNameArray.length-1).join('.')
          fileObj.extension = fileNameArray[fileNameArray.length-1]
          fileObj.shareList = []
          this.file = fileObj
          this.uploadDocument()
        }
      }
      // reader.readAsDataURL(file)
      reader.readAsArrayBuffer(file)
    }
  }
  

  render(){
    this.documents = this.props.documents
    return (
      <div className="p-2">
        {this.state.uploading? <Spinner/>:''}
        {/* <span style={{cursor: "pointer"}} className="fa fa-folder-open-o" aria-hidden="true"></span>
        <input style={{display:"none"}} type="file" className="form-control-file"  aria-describedby="imageFile" onChange={this.onFileSelect} id="document"></input> */}
          <button
            className="btn btn-primary"
            onClick={()=>document.getElementById("file").click()}
            >Upload PDF/Image File
          </button>
          <input 
            style={{display:"none"}} 
            type="file" 
            id="file"
            onChange={this.onFileSelect.bind(this)}>
          </input>
      </div>
    )
  }
}

export default FileSelect