import _ from 'lodash'

export const array = update => fn => (node, state, ctx) => _.map(node, (value, index) => fn(value, update(index, state)))
export const object = update => fn => (node, state, ctx) => _.mapValues(node, (value, key) => fn(value, update(key, state)))
