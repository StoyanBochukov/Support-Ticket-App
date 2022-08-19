import React, {useState, useEffect} from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import {login, reset} from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'

const Login = () => {

  const navigate = useNavigate()

  


  const [formData, setFromData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const dispatch = useDispatch()

  const {user, isLoading, isSuccess, isError, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError){
      toast.error(message)
    }

    //Redirect when logged in
    if(isSuccess || user){
      navigate('/')
    }

    dispatch(reset())
  }, [isError, isSuccess, user, message, navigate, dispatch])

  const onChange = (e) => {
    setFromData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
      email,
      password
    }

    dispatch(login(userData))

   
  }
  if(isLoading){
    return <Spinner />
  }

  return (
    <>
    <BackButton url='/' />
      <section className='heading'>
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please log in to get support</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          
          <div className="form-group">
            <input required type="email" name='email' className="form-control" id='email' value={email} onChange={onChange} placeholder='Enter your email' />
          </div>
          <div className="form-group">
            <input required type="password" name='password' className="form-control" id='password' value={password} onChange={onChange} placeholder='Enter password' />
          </div>
          
          <div className="form-group">
            <button type='submit' className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login