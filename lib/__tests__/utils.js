import {describe, it} from 'mocha';
import {expect} from 'chai';
import { buildRootNode } from '../utils';

describe('utils', () => {
  describe('_buildRootNode', () => {
    it('should build the rootNode with given id and props', () => {
      const html = buildRootNode('the-id', {aa: 10});
      expect(html).to.be.equal('<div aa="10" id="the-id"></div>');
    });

    it('should change className prop to class attribute', () => {
      const html = buildRootNode('the-id', {aa: 10, className: 'abc'});
      expect(html).to.be.equal('<div aa="10" id="the-id" class="abc"></div>');
    });
  });
});
