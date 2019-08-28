import React,{Component}  from 'react';
import './Modal.css'

class FileModal extends Component {
  constructor(props){
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      name: this.props.fileDetails.name
    }
    this.file = this.props.fileDetails
  }

  handleNameChange(e){
    const name = e.target.value
    this.file.name = name
    this.setState({
      name
    })
  }

  render(){
    return (
      <div className="modal" style={{display: "block"}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="float-right">              
                  <button type="button" className="close p-2" onClick={this.props.handleClose} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
              <div className="modal-body">
                <form>
                  <div className="form-group row">
                    <label htmlFor="file-name" className="col-form-label pl-2">File Name:</label>
                    <div className="col-sm-10">                    
                      <input type="text" value={this.state.name} onChange={this.handleNameChange.bind(this)} className="form-control" id="file-name"/>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.props.handleClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={()=>{this.props.onSave(this.file)}}>Save changes</button>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default FileModal