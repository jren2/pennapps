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
  if (name === null || name === undefined || name.length === 0) throw new Error('Invalid Wiki Page');

  // get wiki page text
  const rawText = await getWikiText(name);
  const cleanedText = await cleanWikiText(rawText);
  console.log(cleanedText);

  // sentiment analysis
  return 'sentiment score';
}

module.exports = {
  wikiSentiment
};