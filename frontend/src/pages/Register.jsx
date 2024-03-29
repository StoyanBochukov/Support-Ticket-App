import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import {toast} from 'react-toastify'
import {useSelector, useDispatch} from 'react-redux'
import {register, reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

const Register = () => {

  const [formData, setFromData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })


  const { name, email, password, password2 } = formData

  const dispatch = useDispatch()

  const navigate = useNavigate()


  const {user, isLoading, isSuccess, isError, message} = useSelector(state => state.auth)

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

    if(password !== password2){
      toast.error('Passwords do not match')
    }else{
      const userData = {
        name,
        email,
        password
      }
      dispatch(register(userData))
    }
  }
  if(isLoading){
    return<Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>
          <FaUser /> Register {user}
        </h1>
        <p>Please create an accout</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input required type="text" name='name' className="form-control" id='name' value={name} onChange={onChange} placeholder='Enter your name' />
          </div>
          <div className="form-group">
            <input required type="email" name='email' className="form-control" id='email' value={email} onChange={onChange} placeholder='Enter your email' />
          </div>
          <div className="form-group">
            <input required type="password" name='password' className="form-control" id='password' value={password} onChange={onChange} placeholder='Enter password' />
          </div>
          <div className="form-group">
            <input required type="password" name='password2' className="form-control" id='password2' value={password2} onChange={onChange} placeholder='Confirm password' />
          </div>
          <div className="form-group">
            <button type='submit' className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register