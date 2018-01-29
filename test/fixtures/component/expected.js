const ErrorBoundary = require('./path/to/my/ErrorBoundary.js');

const { Component } = require('react');

class TestComponent extends Component {
    render() {
        return <ErrorBoundary>{this.__r__()}</ErrorBoundary>;
    }

    __r__() {
        return <div />;
    }
}

module.exports = TestComponent;
