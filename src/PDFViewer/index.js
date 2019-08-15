import React, { Component } from 'react';
import * as PdfJs from 'pdfjs-dist';
import { Viewer } from './components/Viewer'

PdfJs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

class PDFViewer extends Component {
  state = {
    pdf: null,
    scale: 1
    };

  componentDidMount() {
    const pdf_data = this.props.file.data
    let loadingTask = PdfJs.getDocument(pdf_data);
    loadingTask.promise.then((pdf)=>{
      console.log(pdf);
      this.props.onDocumentLoadSuccess(pdf)
      this.setState({ pdf });
    });
  }

  render() {
    const { pdf, scale } = this.state;
    return (
      <div className="pdf-context">
        <Viewer
          pdf={pdf}
          scale={scale}
        />
      </div>
    );
  }
}

export default PDFViewer;