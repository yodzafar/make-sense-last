import { LoginForm } from './LoginForm/LoginForm';
import './LoginView.scss';

const LoginView = () => {
  return (
    <div className='Login'>
      <div className='LoginLogo'>
        <img
          draggable={false}
          alt={'main-logo'}
          src={'ico/main-image-color.png'}
        />
      </div>
      <div className='LoginCard'>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginView;
