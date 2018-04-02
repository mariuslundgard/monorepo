'use strict'

const Stream = require('stream')
const prefixedStream = require('../../src/lib/prefixedStream')

function createMockReadStream () {
  const s = new Stream()
  s.readable = true
  return s
}

function createMockWriteStream () {
  const s = new Stream.Writable()
  s._data = ''
  s._write = function (chunk, encoding, done) {
    s._data += chunk.toString()
    done()
  }
  return s
}

describe('lib/prefixedStream', () => {
  it('should prefix each line in a stream', done => {
    const s = prefixedStream.create({ prefix: 'foo > ' })
    const mockSubStdout = createMockReadStream()
    const mockStdout = createMockWriteStream()

    mockSubStdout.pipe(s).pipe(mockStdout)

    mockStdout.on('data', str => {
      console.log(str)
    })

    mockStdout.on('finish', () => {
      expect(mockStdout._data).toEqual(
        'foo > abcdefghijklmnopqrstuvwxyz\nfoo > abc'
      )
      done()
    })

    mockSubStdout.emit('data', 'abc')
    mockSubStdout.emit('data', 'defghi')
    mockSubStdout.emit('data', 'jklmno')
    mockSubStdout.emit('data', 'pqrstuvwxyz\n')
    mockSubStdout.emit('data', 'abc')
    mockSubStdout.emit('end')
  })
})
