import React, { useState } from 'react';
import { Button, Container, Stack, Text } from '@mantine/core';
import BookshelfScene from './BookshelfScene'; 


function UserLandingPage({ user, onLogout }) {
  return (
    <>
    <BookshelfScene secureMode={user.name.toLowerCase() == "guest" ? true : false}/>
      {/* Profile Image */}
      <img 
        src={user.picture} 
        alt="Profile" 
        style={{ 
            borderRadius: '50%', width: 38, height: 38, objectFit: 'cover', 
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1000,
        }} 
      />

      {/* Logout Button */}
      <Button
        color="red"
        onClick={onLogout}
        variant="light"
        style={{
          position: 'fixed',
          top: 20,
          right: 75,
          zIndex: 1000,
        }}
      >
        Log Out
      </Button>

      {/* Welcome Message */}
      <Container size="sm" my="xl" style={{ marginTop: 20, position: 'fixed', left: 10, zIndex: 1000 }}>
        <Stack spacing="sm" align="flex-start">
          <Text
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }} // Adjust colors and degree for your "wave" feel
            size="xl" // Larger size for impact
            weight={700} // Bolder for emphasis
            style={{ fontFamily: 'Poppins, sans-serif' }} // Apply the Google Font
          >
            Welcome, {user.name.toLowerCase()}
          </Text>
        </Stack>
      </Container>

  
    </>
  );
}

export default UserLandingPage;
