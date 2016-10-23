import lowlight from 'lowlight';
import defaultStyle from 'highlight.js-js-styles/dist/styles/default-style';

function assignStyleToElement(style, element) {
  Object.keys(style).forEach(styleKey => element.style[styleKey] = style[styleKey]);
}

function assignPropsToElement(props, element) {
  Object.keys(props).forEach(propKey => {
    if (propKey === 'style') {
     assignStyleToElement(props.style, element);
    }
    else {
      element.setAttribute(propKey, props[propKey]);
    }
  });
}

function createStyleObject(classNames, style) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...style[className]};
  }, {});
}

function createChildren(style, element) {
  return (children, element) => {
    children.forEach(child => {
      const childElement = createElement({ node: child, style });
      element.appendChild(childElement);
    });
  }
}

function createElement({ node, style }) {
  const { properties, type, tagName, value } = node;
  if (type === 'text') {
    const element = document.createElement('span');
    element.innerText = value;
    return element;
  } else if (tagName) {
    const childrenCreator = createChildren(style);
    const elementStyle = createStyleObject(properties.className, style);
    const element = document.createElement(tagName);
    assignStyleToElement(elementStyle, element);
    childrenCreator(node.children, element);
    return element;
  }
}


export default function SyntaxHighlighter(props) {
  const {
    language,
    codeString,
    style = defaultStyle,
    customStyle = {},
    codeTagProps = {},
    querySelector,
    ...rest
  } = props;
  const codeTree = language ? lowlight.highlight(language, codeString) : lowlight.highlightAuto(codeString);
  const defaultPreStyle = style.hljs || {backgroundColor: '#fff'};
  const preProps = Object.assign({}, rest, { style: Object.assign({}, defaultPreStyle, customStyle) });
  const pre = document.createElement('pre');
  assignPropsToElement(preProps, pre);
  const code = document.createElement('code');
  assignPropsToElement(codeTagProps, code);

  codeTree.value.forEach(node => {
    const childElement = createElement({ node, style });
    code.appendChild(childElement);
  });
  pre.appendChild(code);
  const elementToAttachTo = querySelector && document.querySelector(querySelector);
  if (!elementToAttachTo) {
    document.body.appendChild(pre);
  }
  else {
    elementToAttachTo.appendChild(pre);
  }
}

