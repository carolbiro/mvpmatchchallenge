import { useState } from 'react';
import { ApiError } from '../../App';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import { RegisterContainer } from './register.styles';

const defaultFormFields = {
  username: '',
  password: '',
  role: '',
  deposit: ''
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { username, password, role, deposit } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try{        
      const response = await fetch('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role,
          deposit,
        }),
      });
  
      const res = await response.json();
  
      if (!response.ok) {
          throw new ApiError(`${res.message}`);
      }
      resetFormFields();
      alert('User registered successfully!');
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
    <RegisterContainer>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='Username:'
          type='text'
          required
          onChange={handleChange}
          name='username'
          value={username}
        />
        <br />
        <FormInput
          label='Password:'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />
        <br />
        <FormInput
          label='Role:'
          type='text'
          required
          onChange={handleChange}
          name='role'
          value={role}
        />
        <br />
        <FormInput
          label='Deposit:'
          type='text'
          required
          onChange={handleChange}
          name='deposit'
          value={deposit}
        />
        <br />
        <Button type="submit">Register</Button>
      </form>
    </RegisterContainer>
  );
};

export default SignUpForm;
