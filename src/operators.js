import _ from 'lodash'

export const array = update => fn => (node, ctx) => _.map(node, (value, index) => fn(value, update(index, ctx)))
export const object = update => fn => (node, ctx) => _.mapValues(node, (value, key) => fn(value, update(key, ctx)))
