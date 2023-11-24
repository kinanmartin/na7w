import stanza
nlp = stanza.Pipeline('ar')

def mark_pos(text):
    doc = nlp(text)
    print(doc)
    tagged = []
    for sent in doc.sentences:
        for token in sent.tokens:
            # Special case for li + al = lil
            if token.words[0].lemma == "لِ" and token.words[1].text[:2] == "ال" and 'Definite=Def' in token.words[1].feats:
                # Strip the inital alef
                token.words[1].text = token.words[1].text[1:]
            # If this token is a multi-word token, there will be multiple "words" in this list
            tagged.append([(word.text, word.xpos) for word in token.words])

    return tagged


if __name__ == '__main__':
    text = "بالنسبة للسنوار، لم"
    print(mark_pos(text))