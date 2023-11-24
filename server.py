from flask import Flask, request, jsonify
import stanza
from flask_cors import CORS

# Initialize Stanza Arabic pipeline
nlp = stanza.Pipeline('ar')

app = Flask(__name__)
CORS(app)

@app.route('/tag', methods=['POST'])
def tag_text():
    data = request.json
    text = data.get('text')
    
    # Process the text using Stanza
    doc = nlp(text)
    [print(token) for sent in doc.sentences for token in sent.tokens]
    tagged = [(word.text, word.xpos) for sent in doc.sentences for word in sent.words]
    print(tagged)
    # Return the tagged text
    return jsonify(tagged)

if __name__ == '__main__':
    # text = "أبو عبيدة يعلن خسائر إسرائيل خلال الحرب ويوجه رسائل للداخل والخارج"
    # doc = nlp(text)
    # tagged = [(word.text, word.xpos) for sent in doc.sentences for word in sent.words]
    # print(tagged)
    app.run(debug=True, port=8238)

