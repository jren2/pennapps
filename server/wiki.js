const wiki = require('wikijs').default;

const getWikiText = async (title) => {
  const page = await wiki().page(title);
  return page.rawContent();
}

const cleanWikiText = async (rawContent) => {
  let cleanedText = rawContent.toLowerCase();
  let tokens = cleanedText.split(/\W+/);

  return tokens;
}

const wikiSentiment = async (name) => {
  // check input
  if (name === null || name === undefined || name.length === 0) {
    throw new Error('Invalid Wiki Page');
  }

  // get wiki page text
  const rawText = await getWikiText(name);

  // sentiment analysis
  const language = require('@google-cloud/language');
  const client = new language.LanguageServiceClient({
    projectId: 'sealapps22',
    keyFilename: '../../../../desktop/sealapps22-3e7d3dc43ddb.json'
  });

  const document = {
    content: rawText,
    type: 'PLAIN_TEXT',
  };

  const [result] = await client.analyzeSentiment({ document });

  const sentiment = result.documentSentiment;

  return { sentiment, rawText };
}

module.exports = {
  wikiSentiment
};