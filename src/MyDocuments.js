import React, { Component } from 'react'
import { decryptContent } from 'blockstack'
import FileSelect from './FileSelect'
import FileModal from './FileModal'
import PreviewModal from './PreviewModal'
import ShareModal from './ShareModal'
import Spinner from './Spinner'
import FolderAnimation from './FolderAnimation'
import sh from 'shorthash'
import { makeECPrivateKey, getPublicKeyFromPrivate } from 'blockstack'
import './MyDocuments.css'
const bytes = ['Bytes','KB', 'MB']

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
      loader: true,
      dragOver: false
    }
    this.file = {}
    this.getDocument = this.getDocument.bind(this)
    this.uploadDocument = this.uploadDocument.bind(this)
    this.processFiles = this.processFiles.bind(this)
    this.getDocumentList()
  }

  getDocumentList(){
    this.userSession.getFile('documents/index.json')
    .then((data)=> {
      if(data != null){
        let documents = JSON.parse(data)
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

  uploadDocument(fileData, fileDetails){
    let documents = this.state.documents.map((doc)=>{
      doc.data = ""
      return doc
    })
    fileDetails.aesKey =  makeECPrivateKey()
    documents.push(fileDetails)
    this.uploadFile(fileData, fileDetails, documents)
  }

  uploadFile(fileData, fileDetails, documents){
    this.userSession.putFile('documents/index.json', JSON.stringify(documents))
    this.userSession.putFile(`documents/${fileDetails.fileId}`, fileData, {encrypt: getPublicKeyFromPrivate(fileDetails.aesKey)})
    .then(()=>{
      this.setState({
        loader: false,
        documents
      })
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
          this.fileData = data
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
    this.userSession.deleteFile('documents/'+currentDocument.fileId)
    this.userSession.putFile('documents/index.json', JSON.stringify(documents)).then(()=>{
      this.setState({
        loader: false,
        documents
      })
    })
    .catch(()=>{
      this.setState({
        loader: false
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
    this.fileData = {}
    this.setState({ showEditModal: false})
  }
  
  onHidePreview(status){
    if(status.isEditted){
      let fileData = status.imageData
      let imgFileSize = fileData.byteLength
      let count = 0
      while(imgFileSize>1000){
        imgFileSize = imgFileSize/1000
        count +=1
      }
      this.file.size = Math.floor(imgFileSize).toString()+' '+bytes[count]
      this.file.date = new Date()
      let documents = this.updateDocument(this.file)
      this.setState({
        loader: true
      })
      this.uploadFile(fileData, this.file, documents)
    }
    this.file = {}
    this.fileData = {}
    this.setState({ showPreviewModal: false})
  }

  onHideShare(){
    this.file = {}
    this.fileData = {}
    this.setState({ showShareModal: false })
  }
  
  updateDocument(fileDetails){
    let documents = this.state.documents.map((document)=>{
      if(document.fileId===fileDetails.fileId){
        document=fileDetails
      }
      return document
    })
    return documents
  }

  onSaveName(fileDetails){
    const documents = this.updateDocument(fileDetails)
    this.userSession.putFile('documents/index.json', JSON.stringify(documents))
    this.setState({
      showEditModal: false,
      documents
    })
  }

  dragOverHandler(ev) {
    ev.preventDefault();
    if(!this.state.dragOver){
      this.setState({
        dragOver: true
      })
    }
  }

  dragOverLeaveHandler(ev) {
    ev.preventDefault();
    if(ev.target.className==='modal' && this.state.dragOver){
      this.setState({
        dragOver: false
      })
    }
  }

  dropHandler(e){
    console.log('File(s) droppped'); 
    e.preventDefault()
    this.setState({
      dragOver: false
    })
    let length = e.dataTransfer.items.length
    this.filesRemaining = length
    let files = []
    for(let i = 0; i < 1; i++){
      let entry = e.dataTransfer.items[i].webkitGetAsEntry()
      if(entry.isFile){
        console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name)  
        files.push(e.dataTransfer.files[i])    
      } else if (entry.isDirectory){
        console.log('... folder[' + i + '].name = ' + e.dataTransfer.files[i].name)
      }
    }
    this.processFiles(files)
  }

  processFiles(files){
      let file = files[0]
      if (file!==undefined && /\.(jpe?g|png|pdf|docx?|pptx?)$/i.test(file.name)) {
        this.setState({
          loader: true
        })
        const reader  = new FileReader()
        reader.onload= (e)=>{
          let data = e.target.result
          let imgFileSize = data.byteLength
          if(imgFileSize<25000000){
            const fileObj = {}    
            const date = new Date()
            fileObj.date = date
            const timestamp = date.getTime()
            fileObj.fileId = timestamp+sh.unique(file.name)
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
            this.uploadDocument(data, fileObj)
          } 
        }
        // reader.readAsDataURL(file)
        reader.readAsArrayBuffer(file)
      }
  }

  render() {
    const userSession = this.userSession
    return (
        <div className="col-md" onDrop={this.dropHandler.bind(this)} onDragOver={this.dragOverHandler.bind(this)} onDragLeave={this.dragOverLeaveHandler.bind(this)}>
          {this.state.loader? <Spinner/>:''}
          {this.state.dragOver? <FolderAnimation/>:''}
          <FileSelect
            uploadDocument = {this.uploadDocument}  
            userSession={userSession}
            processFiles = {this.processFiles}
          />
          <small className="text-muted pl-2">Supported files types .jpeg, .jpg, .png, .pdf, .doc, .docx, .ppt, .pptx upto 25MB.</small><br></br>
          <small className="text-muted pl-2">Drag and drop currently supports only one file at a time.</small>
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
          <PreviewModal fileDetails={this.file} fileData={this.fileData} handleClose={this.onHidePreview.bind(this)}/>:''}   
          {this.state.showEditModal?
          <FileModal fileDetails={this.file} onSave={this.onSaveName.bind(this)} handleClose={this.onHideRename.bind(this)}/>:''}
          {this.state.showShareModal?
          <ShareModal documents={this.state.documents} userSession={this.userSession} fileDetails={this.file} handleClose={this.onHideShare.bind(this)}/>:''}               
        </div>
    )
  }
}

export default MyDocuments
