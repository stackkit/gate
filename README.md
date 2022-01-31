# Gate

> A simple gate class that can help with protecting and checking user capabilities.

## Install

This package is made to run in your backend because checking the gate access should be done in the backend. But it can be used on the client side. For example to show or hide ui elements or protect client side routes. It is based on the gate functionality in [Laravel](https://laravel.com/docs/8.x/authorization#gates)

```
npm install @stackkit/gate
yarn add @stackkit/gate
```

## Example

### Define the gate rules
```js
// userGate.js

const { Gate } = require('gate')

function gate({ user }) {
  const gate = new Gate({ user })
 
  // run code before checking every other gate
  gate.before(({ user }) => {
    return user.role === 'god'
  })

  // define a gate
  gate.define('edit-users', ({ user }) => {
    return user.role === 'admin'
  })

  gate.define('edit-post', ({ user, post }) => {
    return post.created_by === user.id
  })

  // run code after done checking every other gate
  gate.after(({ user }) => {
    return user.namespaces.length > 0
  })

  return gate
}

module.exports = {
  gate
}
```

### Using the gate rules
```js
// your request handler

const { gate } = require('./gates/userGate')

function handleRequest(req) {
  const gate = useGate({ user })

  if (gate.allows('edit-users')) {
    console.log('user is allowed to edit users')
  }

  const post = prisma.findFirst({ where: { id: req.params.id } })
  if(gate.check('edit-post', { post })) {
    console.log('user is allowed to edit the given post')
  }
}
```
