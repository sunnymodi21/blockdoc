import React,{Component}  from 'react'
import ProcessImage from 'react-imgpro'
import './Modal.css'
import PDFViewer from './PDFViewer'


class PreviewModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      src: '',
      err: null
    }
  }

  onDocumentLoadSuccess ({ numPages }){
    this.setState({
        numPages
    })
  }

  previewFileHTML(file){
    if(file.extension !== undefined){
        if(file.extension==='pdf'){
            return <div>
                        {/* <p>Page {pageNumber} of {numPages}</p> */}
                        <PDFViewer file={{data:file.data}} onDocumentLoadSuccess={this.onDocumentLoadSuccess.bind(this)}/>
                    </div>
        } else {
            const myArray = file.data; //= your data in a UInt8Array
            const blob = new Blob([myArray], {'type': 'image/'+file.extension});
            const url = URL.createObjectURL(blob);
            return <ProcessImage
            image={url}
            resize={{ width: 500, height: 500 }}
            // greyscale={true}
            // contrast={0.4}
            // colors={{brighten: 10}}
            processedImage={(src, err) => this.setState({ src, err})}
          />
        }
    } else {
        return ''
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
                    <div className="pl-5 pt-2 text-white">{file.name}</div>
                    <div>              
                        <button type="button" className="close pr-3 text-white" onClick={this.props.handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>  
                </div>
              <div className="modal-body">   
                {this.previewFileHTML(file)}
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default PreviewModal