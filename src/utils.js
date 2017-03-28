import _ from 'lodash'

/**
 *
 */
export function withMerge (dsl) {
  return (node, ctx) => _.merge({}, node, dsl(node, ctx))
}
