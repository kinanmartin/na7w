from markText import mark_pos
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure logging
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

logging.info(f"Hello from main")

@app.route('/tag', methods=['POST'])
def tag_text():
    data = request.json
    app.logger.debug(f"Received data: {data}")
    try:
        text = data.get('text')
        tagged = mark_pos(text)
        app.logger.debug(f"Tagged text: {tagged}")
        return jsonify(tagged)
    except Exception as e:
        app.logger.error('Error during tagging', exc_info=True)
        return jsonify({'error': str(e)}), 500

# @app.route('/tag', methods=['POST'])
# def tag_text():
#     data = request.json
#     logging.info(data)  
#     text = data.get('text')
    
#     tagged = mark_pos(text)
#     logging.info(tagged)
#     return jsonify(tagged)

if __name__ == '__main__':
    pass
    # app.run(debug=True, port=8238)