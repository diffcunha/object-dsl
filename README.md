# object-dsl
µ functional library to transverse objects using an extendable DSL-like syntax

## Installation

```shell
$ npm i --save object-dsl
```

## Examples

### Simple transformations

```js
import compile, { object } from 'object-dsl'

// Operators
const replace = text => next => node => node.replace('%placeholder%', text)
const toUpper = next => node => node.toUpperCase()

// DSL spec
const dsl = object({
  foo: replace('world'),
  obj: object({
    name: toUpper
  })
})

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
```

### Composition

```js
import compile, { object } from 'object-dsl'

// Operators
const replace = text => next => node => node.replace('%placeholder%', text)
const toUpper = next => node => node.toUpperCase()

// DSL spec
const obj = object({
  name: toUpper
})

const dsl = object({
  foo: replace('world'),
  obj
})

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
```

### `array` and `map` operators 

```js
import compile, { object, array, map } from 'object-dsl'

// Operators
const replace = (placeholder, text) => next => node => node.replace(`%${placeholder}%`, text)
const photo = next => node => `http://image-server.com/files/${node}`

// DSL spec
const dsl = object({
  names: (
    array(
      replace('title', 'Mr.')
    )
  ),
  images: (
    map(
      photo
    )
  )
})

// Compile DSL
const compiled = compile(dsl)

// Run with object
const result = compiled({
  names: [
    '%title% John Doe',
    '%title% John Smith'
  ],
  images: {
    cover: 'cover.png',
    back: 'back.png',
    other: 'other.png'
  }
})

console.log(result)

/*
{
  names: [
    'Mr. John Doe',
    'Mr. John Smith'
  ],
  images: {
    cover: 'http://image-server.com/files/cover.png',
    back: 'http://image-server.com/files/back.png',
    other: 'http://image-server.com/files/other.png'
  }
 }
*/
```

### Passing state

```js
import compile, { withMerge, object, array, map } from 'object-dsl'

// Operators
const item = next => (node, state) => ({ ...node, path: state.path })

// DSL spec
const dsl = object({
  types: map(array(item))
})

// Compile DSL
const update = (state, { key }) => ({ path: [...state.path, key] })
const compiled = compile(dsl, update, { path: ['root'] })

// Run with object
const result = compiled({
  types: {
    type1: [{ id: 'type1_1' }, { id: 'type1_2' }],
    type2: [{ id: 'type2_1' }]
  }
})

console.log(result)

/*
{
  "types": {
    "type1": [{
      "id": "type1_1",
      "path": ["root", "types", "type1", 0]
    }, {
      "id": "type1_2",
      "path": ["root", "types", "type1", 1]
    }],
    "type2": [{
      "id": "type2_1",
      "path": ["root", "types", "type2", 0]
    }]
  }
}
*/
```

## API

