import _ from 'lodash'

// Operators

export const object = obj => next => node => _.mapValues(obj, (fn, key) => next(fn, node[key], { key, node }))
export const array = fn => next => node => _.map(node, (value, key) => next(fn, value, { key, node }))
export const map = fn => next => node => _.mapValues(node, (value, key) => next(fn, value, { key, node }))

/**
 * Compiles the DSL
 * @param {dsl} dsl - dsl function to compile
 * @param {update} [update=_.identity] - state update function
 * @param {object} [initState={}] - initial state
 * @param {object} [ctx={}] - context
 */
export function compile (dsl, update = _.identity, initState = {}, ctx = {}) {
  const next = state => (fn, node, change) => {
    const nextState = update(state, change)
    return fn(next(nextState))(node, nextState, ctx)
  }
  return (obj, state = initState) => dsl(next(state))(obj, state, ctx)
}

// Utils

export function withMerge (fn) {
  return (obj, state) => _.merge({}, obj, fn(obj, state))
}

export default compile
