import sys
sys.dont_write_bytecode = True

from markText import mark_pos

from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/tag', methods=['POST'])
def tag_text():
    data = request.json
    print(data)
    text = data.get('text')
    
    tagged = mark_pos(text)
    print(tagged)
    return jsonify(tagged)

if __name__ == '__main__':
    app.run(debug=True, port=8238)

