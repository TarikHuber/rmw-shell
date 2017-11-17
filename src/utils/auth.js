
export default function isGranted (state, grant) {
  const { auth, lists, paths } = state

  const userGrants = lists[`user_grants/${auth.uid}`]
  const isAdmin = paths[`admins/${auth.uid}`]

  if (auth.isAuthorised !== true) {
    return false
  }

  if (isAdmin === true) {
    return true
  }

  if (userGrants !== undefined) {
    for (let userGrant of userGrants) {
      if (userGrant.key === grant) {
        return userGrant.val === true
      }
    }
  }

  return false
}

export function isAnyGranted (state, grants) {
  if (grants !== undefined) {
    for (let grant of grants) {
      if (isGranted(state, grant) === true) {
        return true
      }
    }
  }

  return false
}

export function isAuthorised () {
  try {
    const key = Object.keys(localStorage).find(e => e.match(/firebase:authUser/))
    const data = JSON.parse(localStorage.getItem(key))
    return data !== null
  } catch (ex) {
    return false
  }
}
