import React, { Component } from 'react'
import { decryptContent } from 'blockstack'
import FileSelect from './FileSelect'
import FileModal from './FileModal'
import PreviewModal from './PreviewModal'
import ShareModal from './ShareModal'
import Spinner from './Spinner'
import './MyDocuments.css'

class MyDocuments extends Component {
  constructor(props){
    super(props)
    this.userSession = this.props.userSession
    this.state = {
      documents: [],
      capturedImageURL:'',
      isCaptured: false,
      fileName:'untitled.jpg',
      showEditModal: false,
      showPreviewModal: false,
      showShareModal: false,
      loader: true
    }
    this.file = {}
    this.getDocument = this.getDocument.bind(this)
    this.getDocumentList()
  }

  getDocumentList(){
    this.userSession.getFile('documents/index.json')
    .then((data)=> {
      if(data != null){
        const documents = JSON.parse(data)
        this.setState({
          documents,
          loader: false
        })
      } else {
        this.setState({
          loader: false
        })        
      }
    })
  }

  getDocument(currentDocument, isDownload){
    this.setState({
      loader: true
    })
    this.userSession.getFile('documents/'+currentDocument.fileId, { decrypt: false })
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

  deleteDocument(currentDocument){
   this.setState({
    loader: true
   })
   const documents = this.state.documents.filter((document)=>{
      return document.fileId===currentDocument.fileId ? false: true
    })
    this.userSession.deleteFile('documents/'+currentDocument.fileId).then(()=>{
      this.userSession.putFile('documents/index.json', JSON.stringify(documents))
      this.setState({
        loader: false,
        documents
      })
    })
  }

  toShortFormat(date){
    const dateObj = new Date(date)
    const month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"]
    return "" + dateObj.getDate() + " " + month_names[dateObj.getMonth()] + " " + dateObj.getFullYear()
  }

  documentList(){
    const documentHTMLList = this.state.documents.map((file) =>
      <tr key={file.date}>
        <td className="text-truncate cursor-pointer" style={{maxWidth: "100px"}} onClick={()=>this.getDocument(file, false)} >
          {`${file.name}.${file.extension}`}
        </td>
        <td className="text-truncate" style={{maxWidth: "80px"}}>{this.toShortFormat(file.date)}</td>
        <td>{file.size}</td>
        <td>
          <span title="Download" className="px-1 fa fa-download cursor-pointer" onClick={()=>this.getDocument(file, true)}>
          </span>
          <span title="Delete" className="px-1 fa fa-trash cursor-pointer" onClick={()=>this.deleteDocument(file)}>
          </span>
          <span title="Rename" className="px-1 fa fa-edit cursor-pointer" onClick={()=>this.onRenameClick(file)}>
          </span>
          <span title="Share" className="px-1 fa fa-share-alt cursor-pointer" onClick={()=>this.onShareClick(file)}>
          </span>
        </td>
      </tr>
    )
    return documentHTMLList
  }
  
  updateDocumentList(documents) {
    this.setState({documents})
  }

  onRenameClick(file){
    this.file = file
    this.setState({
      showEditModal: true
    })
  }

  onShareClick(currentDocument){
    this.file = currentDocument
    this.setState({
      showShareModal: true
    })
  }

  onHideRename(){
    this.file = {}
    this.setState({ showEditModal: false})
  }
  
  onHidePreview(){
    this.file = {}
    this.setState({ showPreviewModal: false})
  }

  onHideShare(){
    this.file = {}
    this.setState({ showShareModal: false})
  }

  onSaveName(fileDetails){
    this.file = fileDetails
    const documents = this.state.documents.map((document)=>{
      if(document.fileId===this.file.fileId){
        document.name=this.file.name
      }
      return document
    })
    this.userSession.putFile('documents/index.json', JSON.stringify(documents))
    this.file = {}
    this.setState({
      showEditModal: false,
      documents
    })
  }

  render() {
    const userSession = this.userSession
    return (
        <div className="col-md">
          {this.state.loader? <Spinner/>:''}
          <FileSelect
            updateDocumentList = {this.updateDocumentList.bind(this)}  
            userSession={userSession}
            documents={this.state.documents}
          />
          {this.state.documents.length===0? <p className="font-weight-light text-center">No files uploaded yet</p>: 
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">File Size</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.documentList()}
            </tbody>
          </table>}
          {this.state.showPreviewModal?
          <PreviewModal fileDetails={this.file} handleClose={this.onHidePreview.bind(this)}/>:''}   
          {this.state.showEditModal?
          <FileModal fileDetails={this.file} onSave={this.onSaveName.bind(this)} handleClose={this.onHideRename.bind(this)}/>:''}
          {this.state.showShareModal?
          <ShareModal documents={this.state.documents} userSession={this.userSession} fileDetails={this.file} handleClose={this.onHideShare.bind(this)}/>:''}               
        </div>
    )
  }
}

export default MyDocuments
