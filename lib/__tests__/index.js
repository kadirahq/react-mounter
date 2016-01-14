import {describe, it} from 'mocha';
import {expect} from 'chai';
import mock from 'mock-require';
import {stub} from 'sinon';
import ReactDOM from 'react-dom/server';

mock('domready', cb => {
  setTimeout(cb, 100);
});

let renderArgs;
mock('react-dom', {
  render: (...args) => {
    renderArgs = args;
  }
});

const {
  _ready,
  _buildRootNode,
  _getRootNode,
  mount,
  withOptions
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
      it('should just return it', () => {
        const node = {aa: 10};
        global.document = {getElementById: stub()};
        global.document.getElementById.returns(node);

        const returnedNode = _getRootNode('the-id');
        expect(returnedNode).to.be.equal(node);

        const args = global.document.getElementById.args[0];
        expect(args).to.be.deep.equal([ 'the-id' ]);
      });
    });

    describe('root node is not in the dom', () => {
      it('should create and return the dom node', () => {
        const node = {aa: 10};
        const doc = {
          getElementsByTagName: stub(),
          getElementById: stub()
        };

        const body = {
          insertAdjacentHTML: stub()
        };

        doc.getElementsByTagName.returns([ body ]);
        doc.getElementById
          .onFirstCall().returns(null)
          .onSecondCall().returns(node);

        global.document = doc;

        const returnedNode = _getRootNode('the-id');
        expect(returnedNode).to.be.equal(node);
        expect(body.insertAdjacentHTML.args[0]).to.be.deep.equal(
          [ 'beforeend', '<div id=\"the-id\"></div>' ]
        );
      });
    });
  });

  describe('mount', () => {
    describe('with default root node config', () => {
      it('should render the given layout and regions to the DOM', () => {
        const node = {aa: 10};
        global.document = {getElementById: stub()};
        global.document.getElementById.returns(node);

        const Layout = ({c}) => c;
        const Item = () => (<p>Hello</p>);

        mount(Layout, {c: <Item />});

        const html = ReactDOM.renderToString(renderArgs[0]);
        expect(html).to.match(/Hello/);
        const rootId = global.document.getElementById.args[0][0];
        expect(rootId).to.be.equal('react-root');
        expect(renderArgs[1]).to.be.equal(node);
      });
    });

    describe('with custom root node config', () => {
      it('should render the given layout and regions to the DOM', () => {
        const node = {aa: 10};
        global.document = {getElementById: stub()};
        global.document.getElementById.returns(node);

        const Layout = ({c}) => c;
        const Item = () => (<p>Hello</p>);

        mount(Layout, {c: <Item />}, {rootId: 'amazing'});

        const html = ReactDOM.renderToString(renderArgs[0]);
        expect(html).to.match(/Hello/);
        const rootId = global.document.getElementById.args[0][0];
        expect(rootId).to.be.equal('amazing');
        expect(renderArgs[1]).to.be.equal(node);
      });
    });
  });

  describe('withOptions', () => {
    it('should call the given function with options', done => {
      const fn = (a, options) => {
        expect(a).to.be.equal('abc');
        expect(options).to.deep.equal({aa: 10});
        done();
      };

      withOptions({aa: 10}, fn)('abc');
    });
  });
});
