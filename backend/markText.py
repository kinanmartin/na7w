import os
import stanza
import logging

# Set up logging
logger = logging.getLogger()

# Initialize the stanza pipeline with the models from the /tmp directory
# stanza_resources_dir = '/tmp/stanza_resources'


try:
    nlp = stanza.Pipeline(
        # dir=stanza_resources_dir,
        lang='ar',
        processors='tokenize,mwt,pos,lemma',
        download_method=None
    )
    logger.info("Stanza pipeline initialized successfully.")
except Exception as e:
    logger.error("An error occurred while initializing the Stanza pipeline.", exc_info=True)
    raise e  

def mark_pos(text):
    try:
        doc = nlp(text)
        tagged = []
        for sent in doc.sentences:
            for i, token in enumerate(sent.tokens):
                # Special case for li + al = lil
                if len(token.words) == 2 and token.words[0].lemma == "لِ" and token.words[1].text[:2] == "ال" and 'Definite=Def' in token.words[1].feats:
                    # Strip the initial alef
                    token.words[1].text = token.words[1].text[2:]
                # Add space to end of token's text only if required:
                if i != len(sent.tokens) - 1 and token.end_char != sent.tokens[i + 1].start_char:
                    token.words[-1].text += ' '
                # If this token is a multi-word token, there will be multiple "words" in this list
                tagged.append([(word.text, word.xpos) for word in token.words])
        return tagged
    except Exception as e:
        logger.error("An error occurred while marking POS.", exc_info=True)
        raise e  

if __name__ == '__main__':
    # For local testing purposes
    text = "بالنسبة- للسنوار، لم."
    print(mark_pos(text))
