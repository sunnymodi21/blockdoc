import React,{Component}  from 'react'
import ProcessImage from 'react-imgpro'
import './Modal.css'
import PDFViewer from './PDFViewer'
import mammoth from 'mammoth/mammoth.browser'

class PreviewModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      fileComponent: <div></div>      
    }
  }

  componentDidMount(){
    this.previewFileHTML(this.props.fileDetails)
  }

  onDocumentLoadSuccess ({ numPages }){
    this.setState({
        numPages
    })
  }

  previewFileHTML(file){
    if(file.extension !== undefined){
        if(file.extension==='pdf'){
            this.setState({
              fileComponent:
              <PDFViewer 
                file={{data:file.data}} 
                onDocumentLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
              />
            })
        } else if(file.extension==='docx' || file.extension==='doc'){          
          mammoth.convertToHtml({arrayBuffer: file.data})
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
            const myArray = file.data; //= your data in a UInt8Array
            const blob = new Blob([myArray], {'type': 'image/'+file.extension});
            const url = URL.createObjectURL(blob);
            this.setState({
              fileComponent:<ProcessImage
              image={url}
              resize={{ width: 500, height: 500 }}
              // greyscale={true}
              // contrast={0.4}
              // colors={{brighten: 10}}
              // processedImage={(src) => this.setState({ src })}
              />
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
      </div>
    )
  }
}

export default PreviewModal