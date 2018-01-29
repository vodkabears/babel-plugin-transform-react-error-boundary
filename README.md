# babel-plugin-transform-react-error-boundary

Wraps each component with your own error boundary component.

## Quick start

Install:
```
npm install --save-dev babel-plugin-transform-react-error-boundary
```

Webpack config example: 
```
{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: IS_DEBUG,
            plugins: [
                [ 'babel-plugin-transform-react-error-boundary', {
                    ErrorBoundary: 'common/components/ErrorBoundary/index.js'
                } ]
            ]
        }
    }
}
```
