/* global Package */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { buildRootNode } from './utils';

export function mounter(layoutClass, regions, options) {
  const el = React.createElement(layoutClass, regions);
  const elHtml = ReactDOMServer.renderToString(el);

  const {rootId, rootProps} = options;
  var rootNodeHtml = buildRootNode(rootId, rootProps);
  var html = rootNodeHtml.replace('</div>', elHtml + '</div>');

  if (typeof Package === 'undefined') {
    const error = 'Server side mounting in only available with Meteor.';
    throw new Error(error);
  }

  if (!Package['kadira:flow-router-ssr']) {
    const error =
      'FlowRouter SSR is required to mount components in the server.';
    throw new Error(error);
  }

  var FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter;
  var ssrContext = FlowRouter.ssrContext.get();
  ssrContext.setHtml(html);
}
