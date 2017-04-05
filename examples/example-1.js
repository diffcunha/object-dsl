import compile from '../src'

// Operators
const replace = text => next => node => node.replace('%placeholder%', text)
const toUpper = next => node => node.toUpperCase()

// DSL spec
const dsl = {
  foo: replace('world'),
  obj: {
    name: toUpper
  }
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
