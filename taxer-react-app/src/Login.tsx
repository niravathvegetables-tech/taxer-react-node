import React, { useState, useEffect } from 'react';
import './Login.css';

interface LoginProps {
  setlogs: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ setlogs }) => {


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setlogs(username, password);
  };


  return (
    <div className='loginPanelcover'>
      <div className='loginPanel'>

        <p>User Name : <input
            type="text"
            value={username}
            className='username'
            onChange={(e) => setUsername(e.target.value)}
          /> </p>

        <p>User Password : <input
            type="password"
            value={password}
            className='username'
            onChange={(e) => setPassword(e.target.value)}
          /> </p>

        <p><a className='logindo' onClick={handleLogin}>Login</a></p>

      </div>
    </div>
  );
};

export default Login;