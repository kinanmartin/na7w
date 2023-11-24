import sys
sys.dont_write_bytecode = True

from flask import Flask, request, jsonify
from flask_cors import CORS

# import stanza
# # Initialize Stanza Arabic pipeline
# nlp = stanza.Pipeline('ar')

from markText import mark_pos


app = Flask(__name__)
CORS(app)

@app.route('/tag', methods=['POST'])
def tag_text():
    data = request.json
    text = data.get('text')
    
    tagged = mark_pos(text)
    print(tagged)
    return jsonify(tagged)

if __name__ == '__main__':
    app.run(debug=True, port=8238)

