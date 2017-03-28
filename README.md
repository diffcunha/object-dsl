# object-dsl
µ functional library to transverse objects using an extendable DSL-like syntax

## Installation

```shell
$ npm i --save object-dsl
```

## Examples

### Simple transformations

```js
import { compileFactory } from 'object-dsl'

// Operators
const replace = update => text => node => node.replace('%placeholder%', text)
const toUpper = update => node => node.toUpperCase()

// Build compile function
const compile = compileFactory({ toUpper, replace })

// Compile DSL
const dsl = compile(({ replace, toUpper }) => ({
  foo: replace('world'),
  obj: {
    name: toUpper
  }
}))

// Run with object
const result = dsl({
  foo: 'hello %placeholder%',
  obj: {
    name: 'foobar',
    index: 1
  }
})

console.log(result)

/*
{
  foo: 'hello world',
  obj: {
    name: 'FOOBAR'
    // index is missing, dsl only generates the 'changes'
  }
}
*/
```

### Composition

```js
import { compileFactory } from 'object-dsl'

// Operators
const replace = update => text => node => node.replace('%placeholder%', text)
const toUpper = update => node => node.toUpperCase()

// Build compile function
const compile = compileFactory({ toUpper, replace })

// Compile DSL
const obj = compile(({ toUpper }) => ({
  name: toUpper
}))

const dsl = compile(({ replace }) => ({
  foo: replace('world'),
  obj
}))

// Run with object
const result = dsl({
  foo: 'hello %placeholder%',
  obj: {
    name: 'foobar',
    index: 1
  }
})

/*
{
  foo: 'hello world',
  obj: {
    name: 'FOOBAR'
    // index is missing, dsl only generates the 'changes'
  }
}
*/

import { withMerge } from 'object-dsl/utils'

const dslWithMerge = withMerge(dsl)
const result = dslWithMerge({
  foo: 'hello %placeholder%',
  obj: {
    name: 'foobar',
    index: 1
  }
})

/*
{
  foo: 'hello world',
  obj: {
    name: 'FOOBAR'
    index: 1
  }
}
*/
```

### `object` and `array` operators 

```js
import { compileFactory } from 'object-dsl'
import { array, object } from 'object-dsl/operators'

// Operators
const replace = update => (placeholder, text) => node => node.replace(`%${placeholder}%`, text)
const photo = update => node => `http://image-server.com/files/${node}`

// Build compile function
const compile = compileFactory({ array, object, replace, photo })

// Compile DSL
const dsl = compile(({ array, object, replace, photo }) => ({
  names: (
    array(
      replace('title', 'Mr.')
    )
  ),
  images: (
    object(
      photo
    )
  )
}))

// Run with object
const result = dsl({
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

## API

