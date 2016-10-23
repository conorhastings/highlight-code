import lowlight from 'lowlight';
import defaultStyle from './styles/default-style';

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
    Object.keys(elementStyle).forEach(styleKey => element.style[styleKey] = elementStyle[styleKey]);
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
  Object.keys(preProps).forEach(propKey => {
    if (propKey === 'style') {
      Object.keys(preProps[propKey]).forEach(styleKey => pre.style[styleKey] = preProps.style[styleKey]);
    }
    else {
      pre.setAttribute(propKey, preProps[propKey]);
    }
  });
  const code = document.createElement('code');
  Object.keys(codeTagProps).forEach(propKey => {
    if (propKey === 'style') {
      Object.keys(codeTagProps[propKey]).forEach(styleKey => code.style[styleKey] = codeTagProps.style[styleKey]);
    }
    else {
      code.setAttribute(propKey, codeTagProps[propKey]);
    }
  });
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

