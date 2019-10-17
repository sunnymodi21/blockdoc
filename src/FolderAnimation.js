import React,{Component}  from 'react';
import './Modal.css'

class FolderAnimation extends Component {

  render(){

    return (
        <div className="modal" style={{display:'block'}}>
            <div className="modal-dialog" role="document">
                <div className="d-flex justify-content-center">
                    <span className="fa fa-folder-open" style={{color: "#fff", fontSize: "1.5em"}}></span>
                </div>
            </div>
        </div>
    )
  }
}

export default FolderAnimation