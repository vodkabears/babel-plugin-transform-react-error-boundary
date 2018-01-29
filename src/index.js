const babylon = require('babylon');

const origRenderMethod = '__r__';
const errorBoundaryName = 'ErrorBoundary';
const errorBoundaryRenderAst = babylon.parse(
    `return <${errorBoundaryName}>{this.${origRenderMethod}()}</${errorBoundaryName}>;`,
    {
        allowReturnOutsideFunction: true,
        plugins: ['jsx']
    }
).program.body[0];

function checkSuperClass(t, superClass) {
    return t.isIdentifier(superClass, { name: 'Component' }) ||
        t.isIdentifier(superClass, { name: 'PureComponent' });
}

function checkSuperClassMembers(t, superClass) {
    return t.isMemberExpression(superClass) && (
        t.isIdentifier(superClass.object, { name: 'React' }) && (
            t.isIdentifier(superClass.property, { name: 'Component' }) ||
            t.isIdentifier(superClass.property, { name: 'PureComponent' })
        )
    );
}

const createReactChecker = (t) => (node) => {
    const superClass = node.superClass;

    return checkSuperClass(t, superClass) ||
        checkSuperClassMembers(t, superClass);
};

module.exports = (_ref) => {
    const t = _ref.types;
    const isReactClass = createReactChecker(t);
    const bodyVisitor = {
        ClassMethod: function(path) {
            const nodeName = path.node.key.name;

            if (nodeName === 'render') {
                this.renderMethod = path;
            }

            if (nodeName === origRenderMethod || nodeName === 'componentDidCatch') {
                this.skipped = true;
            }
        }
    };

    return {
        visitor: {
            Program: {
                exit(path, state) {
                    if (!state.insertErrorBoundary) {
                        return;
                    }

                    if (!state.opts.ErrorBoundary) {
                        throw Error('You must define "ErrorBoundary" property');
                    }

                    path.unshiftContainer('body', t.variableDeclaration('const', [
                        t.variableDeclarator(
                            t.identifier(errorBoundaryName),
                            t.callExpression(t.identifier('require'), [t.stringLiteral(state.opts.ErrorBoundary)])
                        )
                    ]));
                }
            },
            Class(path, pass) {
                if (!isReactClass(path.node)) {
                    return;
                }

                const state = {
                    renderMethod: null
                };

                path.traverse(bodyVisitor, state);
                if (!state.renderMethod || state.skipped) {
                    return;
                }

                state.renderMethod.node.key.name = origRenderMethod;
                path.get('body').unshiftContainer('body',
                    t.classMethod('method', t.identifier('render'), [], t.blockStatement([errorBoundaryRenderAst]))
                );

                pass.insertErrorBoundary = true;
            }
        }
    };
};
