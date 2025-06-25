# PDF Extractor Python Server

## Requirements
- Python 3.8+
- Tesseract OCR (for pytesseract)
- Poppler (for pdf2image)

## Install dependencies
```
pip install -r requirements.txt
```

## Install Tesseract
- Windows: Download from https://github.com/tesseract-ocr/tesseract
- Linux: `sudo apt install tesseract-ocr`
- Mac: `brew install tesseract`

## Install Poppler
- Windows: Download from https://github.com/oschwartz10612/poppler-windows
- Linux: `sudo apt install poppler-utils`
- Mac: `brew install poppler`

## Run the server
```
python app.py
```

The server will start on http://localhost:5000 and accept PDF uploads at `/extract`.

## Client connection
- The React client is already configured to send requests to this server. 