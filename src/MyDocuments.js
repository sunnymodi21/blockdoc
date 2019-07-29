import React, { Component } from 'react'
import FileSelect from './FileSelect'
import Modal from './Modal'

class MyDocuments extends Component {
  constructor(props){
    super(props)
    this.userSession = this.props.userSession
    this.state = {
      documents: [],
      capturedImageURL:'',
      isCaptured: false,
      fileName:'untitled.jpg',
      data: '',
      name:'',
      showEditModal: false
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
        console.log(documents)
        this.setState({
          documents
        })
      }
    })
  }

  getDocument(currentDocument){
    this.userSession.getFile('documents/'+currentDocument.fileId)
    .then((data)=> {
      if(data != null){
        var element = document.createElement('a')
        element.setAttribute('href', data)
        element.setAttribute('download', currentDocument.name)
        element.click()
      }
    })
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
        <td className="text-truncate" style={{maxWidth: "100px"}} >
          {file.name}
        </td>
        <td className="text-truncate" style={{maxWidth: "80px"}}>{this.toShortFormat(file.date)}</td>
        <td>{file.size}</td>
        <td>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-download" onClick={()=>{this.getDocument(file)}}>
          </span>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-trash" onClick={()=>{this.deleteDocument(file)}}>
          </span>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-edit" onClick={()=>{this.onRenameClick(file)}}>
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
    this.setState({ showEditModal: true, name:file.name })
  }

  onHideRename(){
    this.file = {}
    this.setState({ showEditModal: false, name:''})
  }

  onSaveName(){
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
      name:'',
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
          <Modal show={this.state.showEditModal}  onSave={this.onSaveName.bind(this)}  handleClose={this.onHideRename.bind(this)} >
          <form>
              <div className="form-group">
                <label htmlFor="file-name" className="col-form-label">File Name:</label>
                <input type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)} className="form-control" id="file-name"/>
              </div>
          </form>
          </Modal>
        </div>
    )
  }
}

export default MyDocuments
