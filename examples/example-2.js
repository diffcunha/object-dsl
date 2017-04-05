import compile from '../src'

// Operators
const replace = text => next => node => node.replace('%placeholder%', text)
const toUpper = next => node => node.toUpperCase()

// DSL spec
const obj = {
  name: toUpper
}

const dsl = {
  foo: replace('world'),
  obj
}

// Compile DSL
const compiled = compile(dsl)

// Run with object
const result = compiled({
  foo: 'hello %placeholder%',
  obj: {
    name: 'foobar'
  }
})

console.log(result) // { foo: 'hello world', obj: { name: 'FOOBAR' } }

// import { withMerge } from 'object-dsl/utils'

// const dslWithMerge = withMerge(dsl)
// const result = dslWithMerge({
//   foo: 'hello %placeholder%',
//   obj: {
//     name: 'foobar',
//     index: 1
//   }
// })

/*
{
  foo: 'hello world',
  obj: {
    name: 'FOOBAR'
    index: 1
  }
}
*/
