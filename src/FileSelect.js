import React, { Component } from 'react'

const bytes = ['Bytes','KB', 'MB']

class FileSelect extends Component {
  constructor(props){
    super(props)
    this.userSession = this.props.userSession
  }

  uploadDocument(){
    const fileName = this.fileName
    const size = this.size
    this.userSession.getFile('documents/index.json')
    .then((data)=> {
      let documents = []
      if(data != null){
        documents = JSON.parse(data)       
      }
      const date = new Date()
      const timestamp = date.getTime()
      documents.push({name: fileName, size, date, fileId: timestamp })
      this.userSession.putFile('documents/index.json', JSON.stringify(documents))
      this.userSession.putFile(`documents/${timestamp}`, this.data)
      this.props.updateDocumentList(documents)
    })
  }

  onFileSelect(e){
    const file =  e.target.files[0]
    console.log(file.name)
    if (/\.(jpe?g|png|pdf)$/i.test(file.name)) {
      const reader  = new FileReader();
      reader.onload= (e)=>{
        this.fileName = file.name
        this.data = e.target.result
        let imgFileSize = Math.round((this.data.length)*3/4);
        let count = 0
        while(imgFileSize>1000){
          imgFileSize = imgFileSize/1000
          count +=1
        }
        this.size = Math.floor(imgFileSize).toString()+' '+bytes[count]
        this.uploadDocument()
      }
      reader.readAsDataURL(file)
      // reader.readAsBinaryString(file)
    }
  }
  

  render(){
    return (
      <div className="p-2">
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