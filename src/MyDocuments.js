import React, { Component } from 'react'
import { cameraConstraints } from './constants'

class MyDocuments extends Component {
  constructor(props){
    super(props)
    // this.getDocumentList()
    this.userSession = this.props.userSession
    this.dataURL = ''
    this.state = {
      documents: [],
      capturedImageURL:'',
      isCaptured: false,
      fileName:'untitled.jpg'
    }
    this.capture = this.capture.bind(this)
    this.cameraStart = this.cameraStart.bind(this)
    this.getDocument = this.getDocument.bind(this)
    this.uploadDocument = this.uploadDocument.bind(this)
    this.cameraView = {}
    this.track = {}
    this.getDocumentList()
  }

  getDocumentList(){
    this.userSession.getFile('document/index.json')
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

  getDocument(document){
    document = this.state.documents[0]
    this.userSession.getFile('document/'+document.fileId)
    .then((data)=> {
      if(data != null){
        const fileData = data
        this.setState({
          capturedImageURL: data
        })
        console.log(fileData)
      }
    })
  }

  uploadDocument(){
    this.userSession.getFile('document/index.json')
    .then((data)=> {
      let documents = []
      if(data != null){
        documents = JSON.parse(data)       
      }
      const date = new Date()
      const timestamp = date.getTime()
      documents.push({fileName: this.state.fileName, date, fileId: timestamp})
      this.userSession.putFile('document/index.json', JSON.stringify(documents))
      this.userSession.putFile('document/'+timestamp, this.dataURL) 
      this.setState({
        documents
      })
    })
  }

  toShortFormat(date) {
    const dateObj = new Date(date)
    const month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"]
    return "" + dateObj.getDate() + " " + month_names[dateObj.getMonth()] + " " + dateObj.getFullYear()
  }

  documentList(){
    const documentList = this.state.documentList
    const documentItemList =[]
    documentList.forEach((expense, documentItem) =>
    {
      const shortdate = this.toShortFormat(documentItem.date)
      documentItemList.push(<li>key={shortdate}>{shortdate}</li>)
    })
    return documentItemList
  }

  cameraStart() {
    this.setState({
      isCaptured: false
    })
    this.cameraView = document.querySelector("#camera--view")
    navigator.mediaDevices
    .getUserMedia(cameraConstraints)
    .then((stream)=>{
        this.track = stream.getTracks()[0]
        this.cameraView.srcObject = stream
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error)
    })
  }

  capture() {
    const cameraSensor = document.querySelector("#camera--sensor")
    cameraSensor.width = this.cameraView.videoWidth
    cameraSensor.height = this.cameraView.videoHeight
    const ctx = cameraSensor.getContext("2d")
    ctx.filter = "grayscale(100%) contrast(100%)"
    ctx.drawImage(this.cameraView, 0, 0)
    this.dataURL = cameraSensor.toDataURL()
    this.setState({
      isCaptured: true
    })
    this.track.stop()
  }

  render() {
    return (
      <div>
        <h3>Documents</h3>
        <button onClick={this.cameraStart}>Scan</button>
        <canvas id="camera--sensor"></canvas>
        <video hidden={this.state.isCaptured} id="camera--view" autoPlay playsInline></video>
        <button onClick={this.capture}>Capture</button>
        {/* <i className="fas fa-camera"></i> */}
        <button onClick={this.uploadDocument}>Upload Document</button>
        <button onClick={this.getDocument}>Get Document</button>
        
        <img src={this.state.capturedImageURL} alt="" id="camera--output"/>
      </div>
    )
  }
}

export default MyDocuments
