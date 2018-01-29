const ErrorBoundary = require('./path/to/my/ErrorBoundary.js');

const React = require('react');

class TestComponent extends React.PureComponent {
    render() {
        return <ErrorBoundary>{this.__r__()}</ErrorBoundary>;
    }

    __r__() {
        return <div />;
    }
}

module.exports = TestComponent;
