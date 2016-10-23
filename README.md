## Code Highlight

syntax highlighting library using javascript styles. README is WIP.

### Install

`npm install highlight-code --save`

### Javascript Styles!
One of the biggest pain points for me trying to find a syntax highlighter for my own projects was the need to put a stylesheet tag on my page. I wanted to provide out of the box code styling with my modules without requiring awkward inclusion of another libs stylesheets. The styles in this module are all javascript based, and all styles supported by `highlight.js` have been ported! 


### Use

Code Highlight takes a single object argument that looks at the following properties:

* `language` - the language to highlight code in.
* `style` - style object required from <a href="https://github.com/conorhastings/highlight.js-js-styles">highlight.js-js-styles</a>. You can see available styles <a href="https://github.com/conorhastings/highlight.js-js-styles/blob/master/AVAILABLE_STYLES.MD">here</a>. `import { style } from 'highlight.js-js-styles'` . Will use default if style is not included.
* `codeString` - the code string to highlight.
* `customStyle` - properties that will be combined with the top level style on the pre tag, styles here will overwrite earlier styles. 
* `codeTagProps` - properties that will be added to the `<code`> tag that is the direct parent of the highlighted code elements. Useful for styling/assigning classNames.

additional properties will be assigned to the pre tag with `setAttribute`

```js
import SyntaxHighlighter from 'code-higlight';
import { docco } from 'highlight.js-js-styles';

const codeString = `const woah = fun => fun + 1;
const dude = woah(2) + 3;
function thisIsAFunction() {
  return [1,2,3].map(n => n + 1).filter(n !== 3);
}
console.log('making up fake code is really hard');

function itIs() {
  return 'no seriously really it is';
}`;

SyntaxHighlighter({
  codeString,
  language: 'javascript',
  style: docco,
  querySelector: '#app'
});
```
