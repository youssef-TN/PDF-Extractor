import { useState, useRef } from 'react'
import { FileText, Upload, AlertCircle, CheckCircle2, Download, Copy, X } from 'lucide-react'
import "./App.css"

function App() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (selectedFile) => {
    setError('')
    setText('')
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      setError('Please select a valid PDF file.')
      setFile(null)
    }
  }

  const handleInputChange = (e) => {
    handleFileChange(e.target.files[0])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setText('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('http://localhost:5000/extract', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Failed to extract text from PDF.')
      }
      const data = await response.json()
      setText(data.text || 'No text extracted.')
    } catch {
      setError('Failed to extract text from PDF.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setError('Failed to copy text to clipboard.')
    }
  }

  const downloadText = () => {
    const element = document.createElement('a')
    const fileBlob = new Blob([text], { type: 'text/plain' })
    element.href = URL.createObjectURL(fileBlob)
    element.download = `${file?.name?.replace('.pdf', '') || 'extracted'}_text.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const clearFile = () => {
    setFile(null)
    setText('')
    setError('')
  }

  // Make upload area clickable and keyboard accessible
  const handleUploadAreaClick = () => {
    if (!file && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleUploadAreaKeyDown = (e) => {
    if (!file && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      if (fileInputRef.current) fileInputRef.current.click()
    }
  }

  return (
    <div className="pdf-bg">
      <div className="pdf-container">
        {/* Header */}
        <div className="pdf-header">
          <div className="pdf-header-icon">
            <FileText size={32} />
          </div>
          <h1 className="pdf-title">PDF Text Extractor</h1>
          <p className="pdf-subtitle">Extract text from your PDF documents instantly</p>
        </div>

        <div className="pdf-content">
          {/* File Upload Area */}
          <div
            className={`pdf-upload-area${dragActive ? ' drag-active' : ''}${file ? ' has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleUploadAreaClick}
            onKeyDown={handleUploadAreaKeyDown}
            tabIndex={0}
            aria-label="Upload PDF file"
            role="button"
          >
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleInputChange}
              disabled={loading}
              className="pdf-file-input"
              ref={fileInputRef}
              tabIndex={-1}
            />
            
            <div className="pdf-upload-content">
              {file ? (
                <div className="pdf-file-selected">
                  <CheckCircle2 className="pdf-success-icon" size={48} />
                  <div className="pdf-file-info">
                    <p className="pdf-file-name">{file.name}</p>
                    <p className="pdf-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={clearFile} className="pdf-remove-btn">
                    <X className="pdf-remove-icon" size={16} />
                    Remove
                  </button>
                </div>
              ) : (
                <div className="pdf-upload-prompt">
                  <Upload size={48} className="pdf-upload-icon" />
                  <div className="pdf-upload-text">
                    <p className="pdf-upload-title">Drop your PDF here or click to browse</p>
                    <p className="pdf-upload-subtitle">Support for PDF files up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pdf-action-section">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`pdf-extract-btn${(!file || loading) ? ' disabled' : ''}`}
            >
              {loading ? (
                <>
                  <div className="pdf-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="pdf-extract-icon" size={20} />
                  Extract Text
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="pdf-error">
              <AlertCircle className="pdf-error-icon" size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {text && (
            <div className="pdf-results">
              <div className="pdf-results-header">
                <h2 className="pdf-results-title">
                  <FileText className="pdf-results-title-icon" size={20} />
                  Extracted Text
                </h2>
                <div className="pdf-results-actions">
                  <button
                    onClick={copyToClipboard}
                    className={`pdf-action-btn pdf-copy-btn${copySuccess ? ' success' : ''}`}
                  >
                    <Copy className="pdf-copy-icon" size={16} />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadText}
                    className="pdf-action-btn pdf-download-btn"
                  >
                    <Download className="pdf-download-icon" size={16} />
                    Download
                  </button>
                </div>
              </div>
              <div className="pdf-text-output">
                <pre>{text}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App