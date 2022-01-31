function findFunctionByKey(key, gates) {
  if (!key) throw Error('The allows function needs a key to check against')

  const current = gates[key]

  if (!current) return false
  return current
}

class Gate {
  constructor({ user }) {
    this.user = user
    this.gates = {}

    this.beforeCallback = null
    this.afterCallback = null
  }

  define(key, callback) {
    this.gates[key] = callback
  }

  before(callback) {
    this.beforeCallback = callback
  }

  after(callback) {
    this.afterCallback = callback
  }

  allows(key) {
    let result = false

    if (this.beforeCallback && result !== true) result = this.beforeCallback({ user: this.user })

    const callback = findFunctionByKey(key, this.gates)
    if (!callback) return result

    if (result !== true) result = callback({ user: this.user })
    if (this.afterCallback && result !== true) result = this.afterCallback({ user: this.user, result })

    return result
  }

  check(key, props = {}) {
    let result = false

    if (this.beforeCallback && result !== true) result = this.beforeCallback({ user: this.user, ...props })

    const callback = findFunctionByKey(key, this.gates)
    if (!callback) return result

    if (result !== true) result = callback({ user: this.user, ...props })
    if (this.afterCallback && result !== true) result = this.afterCallback({ user: this.user, result, ...props })

    return result
  }

  getScopes() {
    return Object.keys(this.gates)
  }
}

module.exports = {
  Gate
}
