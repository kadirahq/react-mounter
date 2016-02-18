import { describe, it } from 'mocha';
import { expect } from 'chai';
import { mounter } from '../server';

describe('server', () => {
  describe('mounter', () => {
    describe('with FlowRouter', () => {
      it('should set push rendered HTML string to FlowRouter', done => {
        withFlowRouter(({getSSRedHTML}) => {
          const Layout = ({c}) => c;
          const Item = () => (<p>Hello</p>);

          mounter(Layout, {c: <Item />}, {rootId: 'amazing'});
          expect(getSSRedHTML()).to.match(/Hello/);
          setTimeout(done, 0);
        });
      });
    });

    describe('without FlowRouter', () => {
      it('should throw an Error', () => {
        const run = () => {
          const Layout = ({c}) => c;
          const Item = () => (<p>Hello</p>);

          mounter(Layout, {c: <Item />}, {rootId: 'amazing'});
        };

        global.Package = {};
        expect(run).to.throw(/FlowRouter SSR is required/);
        delete global.Package;
      });
    });

    describe('outside of Meteor', () => {
      it('should throw an Error', () => {
        const run = () => {
          const Layout = ({c}) => c;
          const Item = () => (<p>Hello</p>);
          mounter(Layout, {c: <Item />}, {rootId: 'amazing'});
        };

        expect(run).to.throw(/only available with Meteor/);
      });
    });
  });
});

function withFlowRouter(run) {
  let SSRedHTML = null;
  const Package = {
    'kadira:flow-router-ssr': {
      FlowRouter: {
        ssrContext: {
          get() {
            return {
              setHtml(html) {
                SSRedHTML = html;
              }
            };
          }
        }
      }
    }
  };

  const context = {
    getSSRedHTML() {
      return SSRedHTML;
    }
  };

  global.Package = Package;
  run(context);
  delete global.Package;
}
