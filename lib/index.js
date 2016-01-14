/* global document*/

import domready from 'domready';
import ReactDOM from 'react-dom';
import React from 'react';

export let _isDomReady = false;
export function _ready(cb) {
  if (_isDomReady) {
    return cb();
  }

  domready(() => {
    _isDomReady = true;
    setTimeout(cb, 10);
  });
}

export function _buildRootNode(rootId, rootProps) {
  const props = {...rootProps};
  props.id = rootId;
  if (props.className) {
    props.class = props.className;
    delete props.className;
  }

  let propsString = '';
  for (const key in props) {
    if (!(props.hasOwnProperty(key))) {
      continue;
    }

    const value = props[key];
    propsString += ` ${key}="${value}"`;
  }

  return `<div${propsString}></div>`;
}

export function _getRootNode(rootId, rootProps) {
  const rootNode = document.getElementById(rootId);

  if (rootNode) {
    return rootNode;
  }

  const rootNodeHtml = _buildRootNode(rootId, rootProps);
  const body = document.getElementsByTagName('body')[0];
  body.insertAdjacentHTML('beforeend', rootNodeHtml);

  return document.getElementById(rootId);
}

export function mount(layoutClass, regions, options = {}) {
  _ready(() => {
    const {
      rootId = 'react-root',
      rootProps = {}
    } = options;

    const rootNode = _getRootNode(rootId, rootProps);
    const el = React.createElement(layoutClass, regions);
    ReactDOM.render(el, rootNode);
  });
}

export function withOptions(options, fn) {
  return function (...args) {
    const newArgs = [ ...args, options ];
    return fn(...newArgs);
  };
}
