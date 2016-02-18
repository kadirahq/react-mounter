/* global document, Package*/

import React from 'react';

let ReactDOMServer = null;
let ReactDOM = null;
if (typeof window !== 'undefined') {
  // now we are in the server
  ReactDOM = require('react-dom');
} else {
  ReactDOMServer = require('react-dom/server');
}

export let _isDomReady = false;
export function _ready(cb) {
  if (_isDomReady) {
    return cb();
  }

  const domready = require('domready');
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
  options.rootId = options.rootId || 'react-root';
  options.rootProps = options.rootProps || {};

  if (ReactDOM) {
    mountClient(layoutClass, regions, options);
  } else {
    mountServer(layoutClass, regions, options);
  }
}

export function mountServer(layoutClass, regions, options) {
  const el = React.createElement(layoutClass, regions);
  const elHtml = ReactDOMServer.renderToString(el);

  const {rootId, rootProps} = options;
  var rootNodeHtml = _buildRootNode(rootId, rootProps);
  var html = rootNodeHtml.replace('</div>', elHtml + '</div>');

  if (Package['kadira:flow-router-ssr']) {
    var FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter;
    var ssrContext = FlowRouter.ssrContext.get();
    ssrContext.setHtml(html);
  }
}

export function mountClient(layoutClass, regions, options) {
  _ready(() => {
    const {rootId, rootProps} = options;
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
