import _ from 'lodash'

/**
 * Builds a transverse function given an `update` function
 * @param update
 */
function transverseFactory (update, step) {
  return function transverse (dsl, obj, ctx) {
    // If DSL node is function (an operator or other compiled DSL) then call it
    if (_.isFunction(dsl)) {
      return dsl(obj, ctx)
    }
    // Otherwise map the values of the DSL node by calling transverse on them and updating the context
    return _.mapValues(dsl, (value, key) => transverse(dsl[key], obj[key], update(ctx, step({ key, dsl: dsl[key], obj: obj[key] }))))
  }
}

/**
 * Builds a compile function given an operator set, initial context and update function
 * @param operators
 * @param initCtx
 * @param update
 */
export function compileFactory (operators, initCtx = {}, update = _.identity, step = _.noop) {
  const transverse = transverseFactory(update, step)
  const boundOperators = _.mapValues(operators, operator => operator(update))
  return function compile (dslFn) {
    const dsl = _.isFunction(dslFn) ? dslFn(boundOperators) : dslFn
    return function process (node, ctx = initCtx) {
      return transverse(dsl, node, ctx)
    }
  }
}
