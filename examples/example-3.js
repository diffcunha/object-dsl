import compile, { array, map } from '../src'

// Operators
const replace = (placeholder, text) => next => node => node.replace(`%${placeholder}%`, text)
const photo = next => node => `http://image-server.com/files/${node}`

// DSL spec
const dsl = {
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
}

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
