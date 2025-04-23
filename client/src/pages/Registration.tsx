import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [isRegistrated, setIsRegistrated] = useState(false);
  const {registration} = useAuth();
  const navigate = useNavigate();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    registration({
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      password: formData.get('password') as string
    })

    setIsRegistrated(true);
    form.reset()
  }

  useEffect(() => {
    if (isRegistrated) {
      const checkToken = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
        }
      };

      const interval = setInterval(checkToken, 2000);
      return () => clearInterval(interval);
    }
  }, [isRegistrated]);

  return (
    <main className='main'>
      <div className="container">
        <h1 className='title'>Log up</h1>
        <form className='box' onSubmit={submit}>
          <input type="text" className='input' name='name' placeholder='Your name...'/>
          <input type="text" className='input' name='email' placeholder='Your email...'/>
          <input type="text" className='input' name='password' placeholder='Your password ...'/>
          <button className='button'>Log up</button>
          <p>If you had have already account, please, go to <a href='/login'>login page</a></p>
        </form>
      </div>
    </main>
  )
}

export default Registration
