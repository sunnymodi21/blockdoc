import React, { Component } from 'react'

class FileSelect extends Component {
  constructor(props){
    super(props)
    this.userSession = this.props.userSession
    // this.uploadDocument = this.props.uploadDocument
    this.processFile = this.props.processFile
  }

  onFileSelect(e){
    const files =  e.target.files
    this.props.processFiles(files)
  }

  render(){
    return (
      <div className="pl-2 pt-2">
        {/* <span style={{cursor: "pointer"}} className="fa fa-folder-open-o" aria-hidden="true"></span>
        <input style={{display:"none"}} type="file" className="form-control-file"  aria-describedby="imageFile" onChange={this.onFileSelect} id="document"></input> */}
          <button
            className="btn btn-primary"
            onClick={()=>document.getElementById("file").click()}
            >Upload File
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