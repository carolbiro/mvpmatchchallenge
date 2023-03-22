import SignUpForm from '../../components/register/register.component';
import SignInForm from '../../components/login/login.component';

import { AuthenticationContainer } from './auth.styles'

const Authorization= () => {
  return (
    <AuthenticationContainer>
      <SignInForm />
      <SignUpForm />
    </AuthenticationContainer>
  );
};

export default Authorization;
