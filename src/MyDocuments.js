import React, { Component } from 'react'
import FileSelect from './FileSelect'

class MyDocuments extends Component {
  constructor(props){
    super(props)
    this.userSession = this.props.userSession
    this.state = {
      documents: [],
      capturedImageURL:'',
      isCaptured: false,
      fileName:'untitled.jpg',
      data: ''
    }
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

  renameDocument(currentDocument){
    const documents = this.state.documents.map((document)=>{
      if(document.fileId===currentDocument.fileId){
        document.name=currentDocument.name
      }
      return document
    })
    this.userSession.putFile('documents/index.json', JSON.stringify(documents))
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
        <td>
          {file.name}
        </td>
        <td>{this.toShortFormat(file.date)}</td>
        <td>{file.size}</td>
        <td>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-download" onClick={()=>{this.getDocument(file)}}>
          </span>
          <span style={{cursor: "pointer"}} className="px-1 fa fa-trash" onClick={()=>{this.deleteDocument(file)}}>
          </span>
        </td>
      </tr>
    );
    return documentHTMLList
  }
  
  updateDocumentList(documents) {
    this.setState({documents})
  }

  render() {
    const userSession = this.userSession
    return (
        <div className="col-xs col-md">
          <FileSelect
            updateDocumentList = {this.updateDocumentList.bind(this)}  
            userSession={userSession}
          />
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Modified</th>
                <th scope="col">File Size</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.documentList()}
            </tbody>
          </table>
        </div>
    )
  }
}

export default MyDocuments
