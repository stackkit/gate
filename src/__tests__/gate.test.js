const { Gate } = require('../gate')

const user = {
  id: 1
}

const post = {
  id: 1
}

it('allows the definition of a rule', () => {
  const key = 'edit-settings'
  const callback = jest.fn()

  const gate = new Gate({ user })
  gate.define(key, callback)

  expect(gate.gates[key]).toEqual(callback)
})

it('has a function to check if the action is allowed', () => {
  const key = 'edit-settings'
  const callback = jest.fn()

  const gate = new Gate({ user })
  gate.define(key, callback)

  gate.allows(key)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith({ user })
})

it('returns false when a key is not defined', () => {
  const key = 'edit-settings'
  const callback = jest.fn()

  const gate = new Gate({ user })
  gate.define(key, callback)

  const allowed = gate.allows('not-existing')
  expect(allowed).toEqual(false)

  const checked = gate.check('not-existing')
  expect(checked).toEqual(false)
})

it('throws a error when a key is not defined', () => {
  const key = 'edit-settings'
  const callback = jest.fn()

  const gate = new Gate({ user })
  gate.define(key, callback)

  expect(() => { gate.allows() }).toThrow()
  expect(() => { gate.check() }).toThrow()
})

it('allows additional context to check against', () => {
  const key = 'edit-settings'
  const callback = jest.fn()

  const gate = new Gate({ user })
  gate.define(key, callback)

  gate.check(key, { post })

  expect(callback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledWith({ user, post })
})

it('passes the user object to the callback function', () => {
  const expectToBeTrueKey = 'true-key'
  const expectToBeFalseKey = 'false-key'

  const gate = new Gate({ user })
  gate.define(expectToBeTrueKey, ({ user }) => {
    return user.id == 1
  })
  expect(gate.allows(expectToBeTrueKey)).toEqual(true)

  gate.define(expectToBeFalseKey, ({ user }) => {
    return user.id !== 1
  })
  expect(gate.allows(expectToBeFalseKey)).toEqual(false)
})

it('passes the extra props to the check function', () => {
  const expectToBeTrueKey = 'true-key'
  const expectToBeFalseKey = 'false-key'

  const gate = new Gate({ user })

  gate.define(expectToBeTrueKey, ({ user, post }) => {
    return user.id === 1 && post.id === 1
  })

  expect(gate.check(expectToBeTrueKey, { post })).toEqual(true)

  gate.define(expectToBeFalseKey, ({ user, post }) => {
    return user.id !== 1 && post.id !== 1
  })

  expect(gate.check(expectToBeFalseKey, { post })).toEqual(false)
})

it('has a option to run a action before and after the check', () => {
  const key = 'edit-settings'
  const beforeCallback = jest.fn()
  const callback = jest.fn()
  const afterCallback = jest.fn()

  const gate = new Gate({ user })

  gate.before(beforeCallback)
  gate.after(afterCallback)
  gate.define(key, callback)
  gate.allows(key)

  expect(beforeCallback).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(afterCallback).toHaveBeenCalledTimes(1)
})

it('does a call to the before hook and cancels call to the callback if before is true', () => {
  const key = 'edit-settings'
  const beforeCallback = jest.fn(() => true)
  const callback = jest.fn(() => false)

  const gate = new Gate({ user })

  gate.before(beforeCallback)
  gate.define(key, callback)

  expect(gate.allows(key)).toEqual(true)
  expect(callback).toHaveBeenCalledTimes(0)
  expect(beforeCallback).toHaveBeenCalledTimes(1)
  expect(beforeCallback).toHaveBeenCalledWith({ user })
})

it('runs the after hook after the normal callback', () => {
  const key = 'edit-settings'
  const afterCallback = jest.fn(() => true)
  const callback = jest.fn(() => false)

  const gate = new Gate({ user })

  gate.after(afterCallback)
  gate.define(key, callback)

  expect(gate.allows(key)).toEqual(true)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(afterCallback).toHaveBeenCalledTimes(1)
  expect(afterCallback).toHaveBeenCalledWith({ result: false, user })
})

it('runs the before ook when using the check function and sends the props to the before callback', () => {
  const key = 'edit-settings'
  const beforeCallback = jest.fn(({ post }) => post.id === 1)
  const callback = jest.fn(() => false)

  const gate = new Gate({ user })

  gate.before(beforeCallback)
  gate.define(key, callback)

  expect(gate.check(key, { post })).toEqual(true)
  expect(callback).toHaveBeenCalledTimes(0)
  expect(beforeCallback).toHaveBeenCalledTimes(1)
  expect(beforeCallback).toHaveBeenCalledWith({ user, post })
})

it('runs the callback and after that it will run the after hook with the result prop and the given props', () => {
  const key = 'edit-settings'
  const afterCallback = jest.fn(({ post }) => post.id === 1)
  const callback = jest.fn(() => false)

  const gate = new Gate({ user })

  gate.after(afterCallback)
  gate.define(key, callback)

  expect(gate.check(key, { post })).toEqual(true)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(afterCallback).toHaveBeenCalledTimes(1)
  expect(afterCallback).toHaveBeenCalledWith({ post, result: false, user })
})
