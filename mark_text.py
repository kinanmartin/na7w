import stanza
nlp = stanza.Pipeline('ar')

def mark_pos(text):
    doc = nlp(text)
    # [print(token) for sent in doc.sentences for token in sent.tokens]

    # tagged = [(word.text, word.xpos) for sent in doc.sentences for word in sent.words]
    # print(tagged)

    tagged = []
    for sent in doc.sentences:
        for token in sent.tokens:
            # If this token is a multi-word token, there will be multiple "words" in this list
            tagged.append([(word.text, word.xpos) for word in token.words])

    return tagged


if __name__ == '__main__':
    text = "بالنسبة للسنوار، لم"
    print(mark_pos(text))