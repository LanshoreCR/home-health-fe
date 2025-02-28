import { useSelector } from 'react-redux'
import { USER_ROLES } from '../utils/user-roles'

export default function useRole() {
  const user = useSelector(state => state.user)
  const role = user.role

  if (role == null) {
    return {
      isReviewer: false,
      isAuditor: false,
      isExternal: false,
      isNoAccess: false
    }
  }

  return {
    isReviewer: role.includes(USER_ROLES.REVIEWER),
    isAuditor: role.includes(USER_ROLES.AUDITOR) && !role.includes(USER_ROLES.REVIEWER),
    isExternal: role.includes(USER_ROLES.EXTERNAL),
    isNoAccess: role.includes(USER_ROLES.NO_ACCESS)
  }
}
