import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import { useUsers } from '../context/usersContext';

const Profile = () => {
  const {user} = useAuth();
  const {getActiveUser} = useUsers();
  const [isActiveUser, setIsActiveUser] = useState(false);

  useEffect(() => {
    if (!user) return;

    const activeUser = async () => {
      const isActive = await getActiveUser(user?.email);
      setIsActiveUser(isActive);
    }

    activeUser()
  }, [user])
  return (
    <main className='main'>
      <div className="container">
        <h1 className='title'>Profile</h1>
        <div>
          <p>Name:</p>
          <p>{user?.name}</p>
          {!isActiveUser && <p>User isn't active</p>}
        </div>
      </div>
    </main>
  )
}

export default Profile
