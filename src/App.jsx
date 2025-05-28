import { useState } from 'react';
import { Title, Text, Button, Group, Container, Stack, Flex, Space} from '@mantine/core';
import LoginButton from './components/LoginButton';
import Earth from './components/Earth';
import UserLandingPage from './components/UserLandingPage';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function App() {
  const [user, setUser] = useState(null);

  function handleLoginSuccess(userData) {
    setUser(userData);
  }

  function handleLogout() {
    setUser(null);
  }

  return (
    <>
      {user && <UserLandingPage user={user} onLogout={handleLogout} />}
      {!user && (
        <Container size="xl" my="xl">
          <Flex justify="space-between" align="center" direction="row" gap="xl">

            {/* Left: Text & Buttons */}
            <Stack spacing="sm" style={{ flex: 1 }}>
              <Title order={2} c='white'>a-collection-of-cool-creations</Title>
              <Text size="md">by kamran majid</Text>
              <Space h='30pt'/>
              <Group spacing="md">
                <LoginButton onLoginSuccess={handleLoginSuccess} buttonType="google"/>
                <Text>or</Text>
                <LoginButton onLoginSuccess={handleLoginSuccess} buttonType="guest"/>
              </Group>
            </Stack>

            {/* Right: Big Earth */}
            <div style={{ width: 700, height: 700, flexShrink: 0 }}>
              <Canvas>
                <ambientLight intensity={10} />
                <pointLight position={[10, 10, 10]} />
                <Earth />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
          </Flex>
        </Container>
      )}
    </>
  );
}

export default App;
