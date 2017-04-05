import _ from 'lodash'

// Operators
export const shape = obj => next => node => _.reduce(obj, (acc, fn, key) => node[key] ? {...acc, [key]: next(fn, node[key], { key, node }) } : acc, {})
export const array = fn => next => node => _.map(node, (value, key) => next(fn, value, { key, node }))
export const map = fn => next => node => _.mapValues(node, (value, key) => next(fn, value, { key, node }))

/**
 * Compiles the DSL
 * @param {dsl} dsl - dsl function to compile
 * @param {reducer} [reducer=_.identity] - state reducer function
 * @param {object} [initState={}] - initial state
 * @param {object} [initCtx={}] - initial context
 */
export function compile (dsl, reducer = _.identity, initState = {}, initCtx = {}) {
  function transverse (dsl, node, state, ctx) {
    // State encapsulation
    const next = state => (nextFn, nextNode, change) => {
      const nextState = reducer(state, change)
      return transverse(nextFn, nextNode, nextState, ctx)
    }
    // If object then wrap with `shape`
    const fn = _.isPlainObject(dsl) ? shape(dsl) : dsl
    return fn(next(state))(node, state, ctx)
  }
  return (obj, ctx = initCtx) => transverse(dsl, obj, initState, ctx)
}

// Utils

export function withMerge (fn) {
  return (obj, state) => _.merge({}, obj, fn(obj, state))
}

export default compile
