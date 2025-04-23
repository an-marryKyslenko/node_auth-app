import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode,
  isLoggedIn: boolean
}

const PrivateRoute = ({ children, isLoggedIn }: Props) => {
  return isLoggedIn ? children : <Navigate to="/login" />
}

export default PrivateRoute
