import _ from 'lodash'

// Operators
export const object = obj => next => node => _.reduce(obj, (acc, fn, key) => {
  if (node[key]) {
    acc[key] = next(fn, node[key], { key, node })
  }
  return acc
}, {})
export const array = fn => next => node => _.map(node, (value, key) => next(fn, value, { key, node }))
export const map = fn => next => node => _.mapValues(node, (value, key) => next(fn, value, { key, node }))

/**
 * Compiles the DSL
 * @param {dsl} dsl - dsl function to compile
 * @param {update} [update=_.identity] - state update function
 * @param {object} [initState={}] - initial state
 * @param {object} [initCtx={}] - initial context
 */
export function compile (dsl, update = _.identity, initState = {}, initCtx = {}) {
  const next = (state, ctx) => (fn, node, change) => {
    const nextState = update(state, change)
    return fn(next(nextState, ctx))(node, nextState, ctx)
  }
  return (obj, ctx = initCtx) => dsl(next(initState, ctx))(obj, initState, ctx)
}

// Utils

export function withMerge (fn) {
  return (obj, state) => _.merge({}, obj, fn(obj, state))
}

export default compile
