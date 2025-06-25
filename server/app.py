import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

app = Flask(__name__)
CORS(app)


def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"[Erreur PDFPlumber] : {e}")

    if len(text.strip()) == 0:
        print("Aucun texte détecté. OCR en cours...")
        text = extract_text_with_ocr(pdf_path)
    return text

def extract_text_with_ocr(pdf_path):
    text = ""
    try:
        images = convert_from_path(pdf_path, dpi=300)
        for i, image in enumerate(images):
            text += pytesseract.image_to_string(image, lang="fra+eng") + "\n"
    except Exception as e:
        print(f"[Erreur OCR] : {e}")
    return text

@app.route('/extract', methods=['POST'])
def extract():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name
    try:
        text = extract_text_from_pdf(tmp_path)
        return jsonify({'text': text})
    finally:
        os.remove(tmp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 