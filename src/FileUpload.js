import React, { Component } from 'react'
import { cameraConstraints } from './constants'
import ProcessImage from 'react-imgpro'

class FileUpload extends Component {
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
    this.capture = this.capture.bind(this)
    this.cameraStart = this.cameraStart.bind(this)
    this.uploadDocument = this.uploadDocument.bind(this)
    this.onFileSelect = this.onFileSelect.bind(this)
    this.photoWidth = 200
    this.photoHeight = 200
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
      this.userSession.putFile('documents/'+timestamp, this.state.data) 
      this.setState({
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

  renderImage(){
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const width = this.photoWidth,
          height = this.photoHeight    
    canvas.width = width
    canvas.height = height
    ctx.drawImage(this.cameraView, 0, 0,width,height)
    const data = canvas.toDataURL()     
    this.setState({
      data
    })
  }

  capture(){
    this.renderImage()
    this.setState({
      isCaptured: true
    })
    this.track.stop()
  }

  onFileSelect(e){
    const file =  e.target.files[0]
    console.log(file.name)
    if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
      const reader  = new FileReader();
      reader.onload= (e)=>{
        this.setState({
          data: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  render(){
    return (
      <div>
        <h3>Documents</h3>
        <div className="form-group">
          <label htmlFor="document" >
            <span style={{cursor: "pointer"}} className="fa fa-folder-open-o" aria-hidden="true"></span>
            <input style={{display:"none"}} type="file" className="form-control-file"  aria-describedby="imageFile" onChange={this.onFileSelect} id="document"></input>
          </label>
          <small id="imageFile" className="form-text text-muted">Only jpeg or png format allowed</small>
        </div>
        <canvas hidden={true} ref="canvas" id="captured"></canvas>
        <video hidden={this.state.isCaptured} ref='video' autoPlay playsInline></video>
        {this.state.data===''?'':         
          <ProcessImage
            image={this.state.data}
            resize={{ width: 500, height: 500 }}
            greyscale={true}
            contrast={0.4}
            colors={{brighten: 10}}
            processedImage={(src, err) => this.setState({ src, err})}
          />
        }
        <button onClick={this.cameraStart}>Scan</button>
        <button onClick={this.capture}>Capture</button>
        {/* <i className="fas fa-camera"></i> */}
        <button onClick={this.uploadDocument}>Upload Document</button>
      </div>
    )
  }
}

export default FileUpload