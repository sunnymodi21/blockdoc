import React,{Component}  from 'react'
import './Modal.css'
import PDFViewer from './PDFViewer'
import mammoth from 'mammoth/mammoth.browser'
import FilerobotImageEditor from 'filerobot-image-editor'

class PreviewModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      fileComponent: <div></div>,
      isShow: false,
      imageUrl:""      
    }
  }

  componentDidMount(){
    this.previewFileHTML(this.props.fileDetails, this.props.fileData)
  }

  onDocumentLoadSuccess ({ numPages }){
    this.setState({
        numPages
    })
  }

  showImageEditor(){
    this.setState({ 
      isShow: true 
    })
  }

  onEditorClose(){
    this.setState({ 
      isShow: false 
    })
  }

  onEditComplete(data){
    let c = data.canvas
    c.toBlob((blob) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', () => {
        const arrayBuffer = reader.result
        this.props.handleClose({isEditted: true , imageData: arrayBuffer})
      });
      reader.readAsArrayBuffer(blob);
    },'image/jpeg', 0.90);
    // let ctx = data.canvas.getContext("2d")
    // let fileData = ctx.getImageData(0, 0, c.width, c.height)
    // console.log(fileData.data)
    // this.props.handleClose({isEditted: true , imageData: fileData})
  }

  previewFileHTML(file, fileData){
    if(file.extension !== undefined){
      if(file.extension==='pdf'){
          this.setState({
            fileComponent:
            <PDFViewer 
              file={{data:fileData}} 
              onDocumentLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
            />
          })
      } else if(file.extension==='docx' || file.extension==='doc'){          
        mammoth.convertToHtml({arrayBuffer: fileData})
        .then((result)=>{
          // this.setState({loaded: true})
          this.setState({
            fileComponent: <div className="bg-light" dangerouslySetInnerHTML={{__html: 
              result.value}}></div>
          })
        })
        .done();
      } else if(file.extension==='pptx' || file.extension==='ppt') {
        this.setState({
          fileComponent: <div className="bg-light" style={{height: '100px'}}>Preview support for ppt/pptx coming soon</div>
        })
      } else {
          const myArray = fileData
          const blob = new Blob([myArray], {'type': 'image/'+file.extension});
          const url = URL.createObjectURL(blob);
          this.setState({
            fileComponent:
            <div>
              <div 
                title="Edit Image" 
                className="fa fa-edit text-white cursor-pointer"
                onClick={this.showImageEditor.bind(this)}>
              </div>            
              <img
                alt=""
                className="img-fluid"
                src={url}
              />
            </div>,
            imageUrl: url
          })
      }
    }
  }

  render(){
    const file = this.props.fileDetails
    return (
      <div className="modal" style={{display: "block"}}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
            <div className="modal-content modal-transparent">
                <div className="d-flex justify-content-between">
                    {/* <div className="pl-2 pt-1">
                        <button type="button" className="btn btn-secondary" onClick={this.handleNext.bind(this)}>Next</button>                         
                    </div> */}
                    <div className="pl-5 pt-2 text-white">{file.name}.{file.extension}</div>
                    <div>              
                        <button type="button" className="close pr-3 text-white" onClick={this.props.handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>  
                </div>
              <div className="modal-body">   
                {this.state.fileComponent}
              </div>
            </div>
          </div>
          <FilerobotImageEditor
            show={this.state.isShow}
            src={this.state.imageUrl}
            onClose={this.onEditorClose.bind(this)}
            onComplete={this.onEditComplete.bind(this)}
          />
      </div>
    )
  }
}

export default PreviewModal