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
    currentDocument = this.state.documents[0]
    this.userSession.getFile('documents/'+currentDocument.fileId)
    .then((data)=> {
      if(data != null){
        const fileData = data
        const image = new Image()
        const canvas = this.refs.canvas
        console.log(canvas)
        const ctx = canvas.getContext("2d")
        image.onload = function() {
          canvas.width = 100
          canvas.height = 100
          ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 100, 100)
        }
        image.src = fileData
      }
    })
  }

  uploadDocument(){
    this.userSession.getFile('documents/index.json')
    .then((data)=> {
      let documents = []
      if(data != null){
        documents = JSON.parse(data)       
      }
      const date = new Date()
      const timestamp = date.getTime()
      documents.push({fileName: this.state.fileName, date, fileId: timestamp})
      this.userSession.putFile('documents/index.json', JSON.stringify(documents))
      this.userSession.putFile('documents/'+timestamp, this.dataURL) 
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
    documentList.forEach((documentItem) =>
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
    this.cameraView = this.refs.video
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
    const cameraSensor = this.refs.canvas
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
        <canvas ref="canvas" id="captured"></canvas>
        <video hidden={this.state.isCaptured} ref='video' autoPlay playsInline></video>
        <button onClick={this.capture}>Capture</button>
        {/* <i className="fas fa-camera"></i> */}
        <button onClick={this.uploadDocument}>Upload Document</button>
        <button onClick={this.getDocument}>Get Document</button>
      </div>
    )
  }
}

export default MyDocuments
