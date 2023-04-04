import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ApiError } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import { User } from '../../store/user/user.types';
import { LogInContainer, ButtonsContainer } from './login.styles';
import jwt_decode from "jwt-decode";
import { setCurrentUser } from '../../store/user/user.action';

const defaultFormFields = {
  username: '',
  password: '',
};

const SignInForm = () => {
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { username, password } = formFields;
  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };
  const navigate = useNavigate();
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/auth', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username,password}),
      });
      const res = await response.json();

      if (!response.ok) {
        throw new ApiError(`${res.message}`);
      }

      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      var decoded = jwt_decode(res.accessToken) as User;
      dispatch(setCurrentUser(decoded));
      resetFormFields();
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError)
          alert(error.message);
    }
  };

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <LogInContainer>
      <h2>Already have an account?</h2>
      <span>Sign in with your username and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Username'
          type='text'
          required
          onChange={handleChange}
          name='username'
          value={username}
        />

        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />
        <ButtonsContainer>
          <Button type='submit'>Sign In</Button>
        </ButtonsContainer>
      </form>
    </LogInContainer>
  );
};

export default SignInForm;
