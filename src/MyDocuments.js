import React, { Component } from 'react'
import jsPDF from 'jspdf'

class MyDocuments extends Component {
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
    this.getDocument = this.getDocument.bind(this)
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
        this.setState({
          data
        })
      }
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

  render() {
    return (
        <div id="main" className="col-md-7">
          <h3>Documents</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Modified</th>
                <th scope="col">Actions</th>
                <th scope="col">File Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>100kB</td>
              </tr>
            </tbody>
          </table>
        </div>
    )
  }
}

export default MyDocuments
