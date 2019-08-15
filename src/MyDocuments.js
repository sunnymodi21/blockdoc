import React, { Component } from 'react'
import FileSelect from './FileSelect'
import FileModal from './FileModal'
import PreviewModal from './PreviewModal'
import Spinner from './Spinner'

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
      loader: true
    }
    this.file = {}
    this.getDocument = this.getDocument.bind(this)
    this.getDocumentList()
  }

  getDocumentList(){
    this.userSession.getFile('documents/index.json')
    .then((data)=> {
      console.log(data)
      if(data != null){
        const documents = JSON.parse(data)
        console.log(documents)
        this.setState({
          documents,
          loader: false
        })
      }
    })
  }

  getDocument(currentDocument, isDownload){
    this.setState({
      loader: true
    })
    this.userSession.getFile('documents/'+currentDocument.fileId)
    .then((data)=> {
      if(data != null){
        if(isDownload){
          this.downloadFile(currentDocument, data)
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
    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = currentDocument.name+'.'+currentDocument.extension;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  deleteDocument(currentDocument){
   const documents = this.state.documents.filter((document)=>{
      return document.fileId===currentDocument.fileId ? false: true
    })
    this.userSession.putFile('documents/index.json', JSON.stringify(documents))
    this.userSession.deleteFile('documents/'+currentDocument.fileId)
    this.setState({
      documents
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
        <td className="text-truncate" style={{maxWidth: "100px", cursor: "pointer"}} onClick={()=>this.getDocument(file, false)} >
          {`${file.name}.${file.extension}`}
        </td>
        <td className="text-truncate" style={{maxWidth: "80px"}}>{this.toShortFormat(file.date)}</td>
        <td>{file.size}</td>
        <td>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-download" onClick={()=>this.getDocument(file, true)}>
          </span>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-trash" onClick={()=>this.deleteDocument(file)}>
          </span>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-edit" onClick={()=>this.onRenameClick(file)}>
          </span>
        </td>
      </tr>
    );
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
    // const isDownload = false
    // this.getDocument(file, isDownload)
  }

  onHideRename(){
    this.file = {}
    this.setState({ showEditModal: false})
  }
  
  onHidePreview(){
    this.file = {}
    this.setState({ showPreviewModal: false})
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

  handleNameChange(e){
    const name = e.target.value
    this.file.name = name
    this.setState({
      name
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
          />
          {this.state.documents.length===0? <p className="font-weight-light text-center">No files uploaded yet</p>: 
          <table className="table">
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
        </div>
    )
  }
}

export default MyDocuments
