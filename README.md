# Gate

> A simple gate class that can help with protecting and checking user abilities.

### Define the gate rules
```js
import { Gate } from 'gate'

const user = { id: 1, role: 'admin' }

export function useGate({ user }) {
  const gate = new Gate({ user })

  gate.before(({ user }) => {
    return user.role === 'god'
  })

  gate.define('edit-users', ({ user }) => {
    return user.role === 'admin'
  })

  gate.define('edit-post', ({ user, post }) => {
    return post.user_id === user.id
  })

  return gate
}
```

### Use the gate rules
```js
import { useGate } from 'domain/gate'

const gate = useGate({ user })

gate.allows('edit-users')

const post = db.get('post')
gate.check('edit-post', { post })
```
