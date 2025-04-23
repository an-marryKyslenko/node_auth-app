import React, { useEffect } from 'react'
import { useUsers } from '../context/usersContext'

const Users = () => {
  const {users, getUsers} = useUsers();

  useEffect(() => {
    getUsers()
  }, [])
  return (
    <main className='main'>
      <div className="container">
        <h1 className="title">Users</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default Users
