/* global document*/

import React from 'react';
import ReactDOM from 'react-dom';
import domready from 'domready';
import { buildRootNode } from './utils';

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

export function _getRootNode(rootId, rootProps) {
  const rootNode = document.getElementById(rootId);

  if (rootNode) {
    return rootNode;
  }

  const rootNodeHtml = buildRootNode(rootId, rootProps);
  const body = document.getElementsByTagName('body')[0];
  body.insertAdjacentHTML('beforeend', rootNodeHtml);

  return document.getElementById(rootId);
}

export function mounter(layoutClass, regions, options) {
  _ready(() => {
    const {rootId, rootProps} = options;
    const rootNode = _getRootNode(rootId, rootProps);
    const el = React.createElement(layoutClass, regions);
    ReactDOM.render(el, rootNode);
  });
}
