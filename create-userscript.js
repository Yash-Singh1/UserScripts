const inquirer = require('inquirer');
const fs = require('fs');

const automatedComment =
  '<!-- DO NOT TOUCH: AUTOMATED INSERTION POINT FOR NEXT USERSCRIPT CARD -->';

const olderEditor = process.env.EDITOR;

process.env.EDITOR = 'nano --syntax=javascript';

inquirer
  .prompt([
    {
      name: 'name',
      type: 'input',
      message: 'The name of the new userscript:'
    },
    {
      name: 'description',
      type: 'input',
      message: 'The description of the new userscript:'
    },
    {
      name: 'code',
      type: 'editor',
      message: 'The main code for the userscript:'
    },
    {
      name: 'icon',
      type: 'input',
      message: 'URL to an icon representing the new userscript:'
    },
    {
      name: 'match',
      type: 'input',
      message: 'List of matching URL Wildcard Patterns seperated by a comma:'
    },
    {
      name: 'keywords',
      type: 'input',
      message: 'List of keywords each seperated by a space'
    }
  ])
  .then((answers) => {
    const shortName = answers.name.replaceAll(' ', '_');
    try {
      fs.mkdirSync(shortName);
    } catch {}
    fs.writeFileSync(
      shortName + '/' + shortName + '.user.js',
      `// ==UserScript==
// @name         ${answers.name}
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  ${answers.description}
// @author       Yash Singh
${answers.match
  .split(',')
  .map((matchInput) => '// @match        ' + matchInput.trim())
  .join('\n')}${
        answers.icon
          ? `
// @icon         ${answers.icon}`
          : ''
      }
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/${shortName}#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/${shortName}#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/${shortName}/${shortName}.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/${shortName}/${shortName}.user.js
// ==/UserScript==

${answers.code}`
    );
    fs.writeFileSync(
      shortName + '/README.md',
      `# ${answers.name}

${answers.description}
`
    );
    const insertionPointSplit = fs
      .readFileSync('docs/index.html', 'utf-8')
      .split(automatedComment);
    const insertionIndent =
      insertionPointSplit[0].split('\n')[
        insertionPointSplit[0].split('\n').length - 1
      ];

    fs.writeFileSync(
      'docs/index.html',
      insertionPointSplit[0] +
        `<userscript-card name="${answers.name}" keywords="${answers.keywords}">
${insertionIndent}  ${answers.description}
${insertionIndent}</userscript-card>
${insertionIndent}${automatedComment}` +
        insertionPointSplit.slice(1).join(automatedComment)
    );
    process.env.EDITOR = olderEditor;
  })
  .catch((error) => {
    process.env.EDITOR = olderEditor;
    throw error;
  });
