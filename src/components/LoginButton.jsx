import { useState, useEffect, useRef } from 'react';
import { Text, Button} from '@mantine/core';

const CLIENT_ID = '420394102939-u4nfikoc6d9ggk24d42jcb1s3fo3t9vj.apps.googleusercontent.com';

function LoginButton({ onLoginSuccess, onLoginError, buttonType }) {
  const googleButtonRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Google button only once when component mounts
    if (window.google && googleButtonRef.current && !user) {
      googleButtonRef.current.innerHTML = ''; // Clear button container
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
      });
    }
  }, [user]);

  function handleCredentialResponse(response) {
    if (response.credential) {
      const userObject = parseJwt(response.credential);
      setUser(userObject);
      if (onLoginSuccess) onLoginSuccess(userObject);
    } else {
      if (onLoginError) onLoginError('No credential received');
    }
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  return (
    <>
      {buttonType == "google" ? 
        <div ref={googleButtonRef} /> : 
        <Button 
          size="md" 
          variant="default" 
          onClick={() => {
            // If the user is logging in as a guest, autofill with relevant guest credentials
            let userObj = {
              name: "guest", 
              picture: "/earth.png"
            }; 
            setUser(userObj); 
            onLoginSuccess(userObj); 
          }}
        >
          Continue as guest
        </Button>
      }
    </>
  );
}

export default LoginButton;
