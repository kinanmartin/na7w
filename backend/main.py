from flask import Flask, request, jsonify
from flask_cors import CORS
from markText import mark_pos
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

@app.route('/tag', methods=['POST'])
def tag_text():
    data = request.json
    logging.info(f"Received data: {data}")
    try:
        text = data.get('text')
        tagged = mark_pos(text)
        logging.info(f"Tagged text: {tagged}")
        return jsonify(tagged)
    except Exception as e:
        logging.error('Error during tagging', exc_info=True)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
