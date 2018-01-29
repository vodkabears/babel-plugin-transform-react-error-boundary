const ErrorBoundary = require('./path/to/my/ErrorBoundary.js');

const { PureComponent } = require('react');

class TestComponent extends PureComponent {
    render() {
        return <ErrorBoundary>{this.__r__()}</ErrorBoundary>;
    }

    __r__() {
        return <div />;
    }
}

module.exports = TestComponent;
