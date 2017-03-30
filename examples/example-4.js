import compile, { withMerge, object, array, map } from '../src'

// Operators
const item = next => (node, state) => ({ ...node, path: state.path })

// DSL spec
const dsl = object({
  types: map(array(item)),
})

// Compile DSL
const update = (state, { key }) => ({...state, path: [...state.path, key] })
const compiled = compile(dsl, update, { path: ['root'] })

// Run with object
const result = compiled({
  types: {
    type1: [{ id: 'type1_1' }, { id: 'type1_2' }],
    type2: [{ id: 'type2_1' }]
  }
})

console.log(JSON.stringify(result, null, '  '))
