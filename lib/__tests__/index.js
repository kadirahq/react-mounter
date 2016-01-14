import {describe, it} from 'mocha';
import {expect} from 'chai';
import mock from 'mock-require';

mock('domready', (cb) => {
  setTimeout(cb, 100);
});

const {
  _ready,
  _buildRootNode,
  mount
} = require('../');

describe('react-mounter', () => {
  describe('_ready', () => {
    describe('dom is not loaded', () => {
      it('should wait and fire callback after ready', done => {
        const start = Date.now();
        _ready(() => {
          const diff = Date.now() - start;
          expect(diff >= 110).to.be.equal(true);
          done();
        });
      });
    });

    describe('dom is already loaded', () => {
      it('should fire callback immediately', () => {
        let cnt = 0;
        _ready(() => {
          cnt = 100;
        });
        expect(cnt).to.be.equal(100);
      });
    });
  });

  describe('_buildRootNode', () => {
    it('should build the rootNode with given id and props', () => {
      const html = _buildRootNode('the-id', {aa: 10});
      expect(html).to.be.equal('<div aa="10" id="the-id"></div>');
    });

    it('should change className prop to class attribute', () => {
      const html = _buildRootNode('the-id', {aa: 10, className: 'abc'});
      expect(html).to.be.equal('<div aa="10" id="the-id" class="abc"></div>');
    });
  });

  describe('_getRootNode', () => {
    describe('root node is already in the dom', () => {
      it('should just return it');
    });

    describe('root node is not in the dom', () => {
      it('should create and return the dom node');
    });
  });

  describe('mount', () => {
    describe('with default root node config', () => {
      it('should render the given layout and regions to the DOM');
    });

    describe('with custom root node config', () => {
      it('should render the given layout and regions to the DOM');
    });
  });

  describe('withOptions', () => {
    it('should call the given function with options');
  });
});
