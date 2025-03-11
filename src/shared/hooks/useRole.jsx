import { useSelector } from 'react-redux'
import { USER_ROLES } from '../utils/user-roles'

export default function useRole() {
  const user = useSelector(state => state.user)
  const role = user.role

  if (role == null) {
    return {
      isAdmin: false,
      isUser: false,
      isExternal: false,
      isNoAccess: false
    }
  }

  return {
    isAdmin: role.includes(USER_ROLES.ADMIN),
    isUser: role.includes(USER_ROLES.USER) && !role.includes(USER_ROLES.ADMIN),
    isExternal: role.includes(USER_ROLES.EXTERNAL),
    isNoAccess: role.includes(USER_ROLES.NO_ACCESS)
  }
}
