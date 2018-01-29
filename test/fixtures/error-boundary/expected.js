const { Component } = require('react');

class ErrorBoundary extends Component {
    componentDidCatch() {}

    render() {
        return <div />;
    }
}

module.exports = ErrorBoundary;
