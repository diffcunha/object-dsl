import compile, { withMerge, array, map } from '../src'

// Operators
const item = next => (node, state) => ({ path: state.path })

// DSL spec
const dsl = {
  types: (
    map(
      array(
        item
      )
    )
  )
}

// Compile DSL
const reducer = (state, { key }) => ({ path: [...state.path, key] })
const initState = { path: ['root'] }
const compiled = compile(dsl, reducer, initState)

// Run with object
const obj = {
  types: {
    type1: [
      { id: 'type1_1' },
      { id: 'type1_2' }
    ],
    type2: [
      { id: 'type2_1' }
    ]
  }
}

let result = compiled(obj)

console.log(JSON.stringify(result, null, '  '))

/*
{
  types: {
    type1: [
      { path: ['root', 'types', 'type1', 0] },
      { path: ['root', 'types', 'type1', 1] }
    ],
    type2: [
      { path: ['root', 'types', 'type2', 0] }
    ]
  }
}
*/

result = withMerge(compiled)(obj)

console.log(JSON.stringify(result, null, '  '))
