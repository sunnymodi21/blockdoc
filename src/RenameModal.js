import React, { Component } from "react"
import './RenameModal.css'

class RenameModal extends Component {
  constructor(){
    this.state = { show: false }
  }

  showModal(){
    this.setState({ show: true })
  }

  hideModal(){
    this.setState({ show: false })
  }

  render() {
    const showHideClassName = show ? "modal display-block" : "modal display-none"
    return (
        <div className={showHideClassName}>
            <button onClick={handleClose}>close</button>
        </div>
    )
  }
}

export default RenameModal