import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';
import { EffectComposer, Bloom, Vignette, DepthOfField, ToneMapping } from '@react-three/postprocessing';
import { Drawer, Box, Text, Title, Paper, Group, Anchor, SimpleGrid, Card, Image, Badge, Button } from '@mantine/core'; // Import Mantine components
import { useDisclosure } from '@mantine/hooks'; // Import Mantine hook for drawer
import { Carousel } from '@mantine/carousel'; // Import Mantine Carousel
import { Document, Page, pdfjs } from 'react-pdf'; // Import react-pdf components
import 'react-pdf/dist/Page/AnnotationLayer.css'; // PDF annotation layer styles
import 'react-pdf/dist/Page/TextLayer.css'; // PDF text layer styles
import { Mail, Linkedin, Github, Phone as PhoneIcon } from 'lucide-react'; // Import icons from lucide-react
import TheUniverse from '../assets/the-universe.png'; 
import WorldStaraunts from '../assets/world-staraunts.png'; 
import DevPost from '../assets/devpost.png'; 
import IHatePaywalls from '../assets/i-hate-paywalls.png'; 
import WordSearch from '../assets/word-search.png'; 
import ExoQuery from '../assets/exo-query.png'; 
import SpaceX from '../assets/spacex.jpeg'; 


// Configure react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

// Import the GLB models directly from their paths
import PhoneModel from '../assets/phone.glb';
import BookGLBModel from '../assets/book.glb';
import PapersModel from '../assets/pileofpapers.glb';

// --- Phone Component ---
// This component displays the phone model and handles its animation and click events.
function Phone({ initialPosition, selectedPosition, isSelected, onClick, title, ...props }) {
  const { scene } = useGLTF(PhoneModel);

  // Apply shadows to all meshes within the phone model
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Clone the scene to ensure each instance is independent
  const clonedScene = scene.clone();

  // Use useSpring for smooth position animation
  const springProps = useSpring({
    position: isSelected ? selectedPosition : initialPosition,
    config: { mass: 1, tension: 200, friction: 20 }, // Configure animation speed and bounciness
  });

  return (
    <a.group
      position={springProps.position} // Apply animated position
      onClick={onClick} // Pass click handler
      castShadow
      receiveShadow
      {...props}
    >
      <primitive object={clonedScene} />
      {/* HTML Title Pop-up (visible when selected) */}
      {isSelected && (
        <Html position={[0, 0.15, 0.1]} center>
          <div style={{ background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px', color: 'white', whiteSpace: 'nowrap', fontSize: '1.2em' }}>
            {title}
          </div>
        </Html>
      )}
    </a.group>
  );
}

// --- BookModel Component ---
// This component displays the book model and handles its animation and click events.
const BookModel = ({ initialPosition, selectedPosition, rotation, scale, onClick, isSelected, title }) => {
  const groupRef = useRef();
  const { scene } = useGLTF(BookGLBModel);

  // Apply shadows to all meshes within the book model
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Clone the scene to ensure each instance is independent
  const clonedScene = scene.clone();

  // Use useSpring for smooth position animation
  const springProps = useSpring({
    position: isSelected ? selectedPosition : initialPosition,
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <a.group
      ref={groupRef}
      position={springProps.position} // Apply animated position
      rotation={rotation}
      scale={scale}
      onClick={onClick} // Pass click handler
      castShadow
      receiveShadow
    >
      <primitive object={clonedScene} />
      {/* HTML Title Pop-up (visible when selected) */}
      {isSelected && (
        <Html position={[0, 0.3, 0.1]} center>
          <div style={{ background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px', color: 'white', whiteSpace: 'nowrap', fontSize: '1.2em' }}>
            {title}
          </div>
        </Html>
      )}
    </a.group>
  );
};

// --- Papers Component ---
// This component displays the papers model and handles its animation and click events.
function Papers({ initialPosition, selectedPosition, isSelected, onClick, title, ...props }) {
  const { scene } = useGLTF(PapersModel);

  // Apply shadows to all meshes within the papers model
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Clone the scene to ensure each instance is independent
  const clonedScene = scene.clone();

  // Use useSpring for smooth position animation
  const springProps = useSpring({
    position: isSelected ? selectedPosition : initialPosition,
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <a.group
      position={springProps.position} // Apply animated position
      onClick={onClick} // Pass click handler
      castShadow
      receiveShadow
      {...props}
    >
      <primitive object={clonedScene} />
      {/* HTML Title Pop-up (visible when selected) */}
      {isSelected && (
        <Html position={[0, 0.1, 0.1]} center>
          <div style={{ background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px', color: 'white', whiteSpace: 'nowrap', fontSize: '1.2em' }}>
            {title}
          </div>
        </Html>
      )}
    </a.group>
  );
}

// --- Bookshelf Component ---
// This component renders the static bookshelf structure.
const Bookshelf = ({ woodColor = '#8B4513' }) => {
  const shelfRef = useRef();

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: woodColor,
    metalness: 0.0,
    roughness: 0.8,
  });

  const shelfWidth = 2.0;
  const shelfHeight = 1.5;
  const shelfDepth = 0.5;
  const panelThickness = 0.05;

  return (
    <group ref={shelfRef} position={[0, -0.7, 0]} castShadow receiveShadow>
      {/* Back panel */}
      <mesh position={[0, 0, -shelfDepth / 2 + panelThickness / 2]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[shelfWidth, shelfHeight, panelThickness]} />
      </mesh>

      {/* Bottom shelf */}
      <mesh position={[0, -shelfHeight / 2 + panelThickness / 2, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[shelfWidth, panelThickness, shelfDepth]} />
      </mesh>

      {/* Top shelf */}
      <mesh position={[0, shelfHeight / 2 - panelThickness / 2, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[shelfWidth, panelThickness, shelfDepth]} />
      </mesh>

      {/* Middle shelf */}
      <mesh position={[0, 0, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[shelfWidth, panelThickness, shelfDepth]} />
      </mesh>

      {/* Left side panel */}
      <mesh position={[-shelfWidth / 2 + panelThickness / 2, 0, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[panelThickness, shelfHeight, shelfDepth]} />
      </mesh>

      {/* Right side panel */}
      <mesh position={[shelfWidth / 2 - panelThickness / 2, 0, 0]} material={woodMaterial} castShadow receiveShadow>
        <boxGeometry args={[panelThickness, shelfHeight, shelfDepth]} />
      </mesh>
    </group>
  );
};

// --- Main Bookshelf Scene Component ---
export function BookshelfScene({secureMode}) {
  // State to manage the currently selected object's ID
  const [selectedObject, setSelectedObject] = useState(null);
  // State and hook for Mantine Drawer visibility
  const [opened, { open, close }] = useDisclosure(false);
  // State to hold the content to display in the drawer
  const [drawerContent, setDrawerContent] = useState(null);
  // State for PDF page number
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new document load
  };

  // Define properties for the single book (now Personal Projects)
  const singleBook = {
    id: 'book-1',
    title: 'Projects of varying coolness',
    description: (
      <Carousel
        withIndicators
        height={400}
        slideSize="100%"
        slideGap="md"
        loop
        align="start"
        className="mt-4"
      >
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={SpaceX}
                height={160}
                alt="Project 1"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>SWE @ SpaceX</Text>
              <Badge color="yellow" variant="light">
                Work Experience
              </Badge>
            </Group>
            <Box> 
              <Text size="sm" c="dimmed" mb="xs">
                Worked on Starlink GNC, and then pivoted to F9 & Starship ground and optical software (some information has been redacted to comply with NDA requirements).
              </Text>
              {secureMode ? "Please login for more information." : 
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                <li>Hardware data pipeline: built an end-to-end telemetry stream using Kafka, InfluxDB, and various SpaceX internal tools (responsible for tens of millions in cost-savings).</li>
                <li>Tracking gimbal reverse engineering: built a custom library to control a vendor gimbal to track launch vehicles.</li>
                <li>Capacity planning tool: created a full-stack React/Node/Tornado web application to model future trends in global ground asset planning for Starlink.</li>
                <li>Backhaul algorithm development: built limit-of-physics downlink prioritization algorithms for Starlink satellite connections to minimize latency through fiber paths.</li>
              </ul>}
            </Box>
          </Card>
        </Carousel.Slide>
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={TheUniverse}
                height={160}
                alt="Project 1"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>The Universe</Text>
              <Badge color="green" variant="light">
                NASA
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Used NASA 8k texture mappings for exoplanets and the sun. Implemented performance enhancements for mobile usage. Zoom in!
            </Text>
            <Anchor href="https://kamranmajid41.github.io/the-universe" target="_blank" mt="md" className="block text-blue-600 hover:underline">
              Link
            </Anchor>
          </Card>
        </Carousel.Slide>
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={WorldStaraunts}
                height={160}
                alt="Project 2"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>world-staraunts</Text>
              <Badge color="blue" variant="light">
                React
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              React app to plot global cuisines you've tried.
            </Text>
            <Anchor href="https://kamranmajid41.github.io/world-staraunts" target="_blank" mt="md" className="block text-blue-600 hover:underline">
              Link
            </Anchor>
          </Card>
        </Carousel.Slide>
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={WordSearch}
                height={160}
                alt="Project 3"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Word Search Generator</Text>
              <Badge color="yellow" variant="light">
                AI
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Put in your OpenAPI key, give it any prompt, and a word search puzzle will be automatically generated and downloaded (e.g. flora in south america).
            </Text>
            <Anchor href="https://kamranmajid41.github.io/word-search-generator" target="_blank" mt="md" className="block text-blue-600 hover:underline">
              Link
            </Anchor>
          </Card>
        </Carousel.Slide>
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={IHatePaywalls}
                height={160}
                alt="Project 3"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>i-hate-paywalls</Text>
              <Badge color="yellow" variant="light">
                Node
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Text-to-speech & PDF-to-text with no paywalls.
            </Text>
            <Anchor href="https://kamranmajid41.github.io/i-hate-paywalls" target="_blank" mt="md" className="block text-blue-600 hover:underline">
              Link
            </Anchor>
          </Card>
        </Carousel.Slide>
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={DevPost}
                height={160}
                alt="Project 3"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>Hackathon Projects (1st Place /700 at Yale, etc.)</Text>
              <Badge color="yellow" variant="light">
                Hackathons
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Projects include: a collaborative learning platform, a ventilator splitter, and an AR decoration app.
            </Text>
            <Anchor href="https://devpost.com/kamranmajid41" target="_blank" mt="md" className="block text-blue-600 hover:underline">
              Link
            </Anchor>
          </Card>
        </Carousel.Slide>
        <Carousel.Slide>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={ExoQuery}
                height={160}
                alt="Project 3"
              />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>exo-query</Text>
              <Badge color="yellow" variant="light">
                NASA
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Detailed information about all currently recognized exoplanets and automated texture generation using noise algorithms.
            </Text>
            <Anchor href="https://kamranmajid41.github.io/exo-query" target="_blank" mt="md" className="block text-blue-600 hover:underline">
              Link
            </Anchor>
          </Card>
        </Carousel.Slide>
        
      </Carousel>
    ),
    initialPosition: [0.8, -0.7 + 0.05 / 2 + 0.0, 0.05], // Original position on shelf
    selectedPosition: [0.8, -0.7 + 0.05 / 2 + 0.0, 0.5], // Position when selected (moved forward)
    rotation: [0, Math.PI / 2, 0],
    scale: [0.0275, 0.0275, 0.0275]
  };

  // Define properties for the single phone (now Contact Info)
  const singlePhone = {
    id: 'phone-1',
    title: 'Contact Information',
    description: (
      <Paper shadow="sm" p="lg" radius="md" withBorder className="mt-4">
        <Title order={3} className="mb-4 text-center text-gray-800">Get in Touch!</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Group wrap="nowrap" align="center">
            <Mail size={24} className="text-blue-600" />
            <Box>
              <Text fw={500}>Email</Text>
              <Anchor href="mailto:kamranmajid41@gmail.com" target="_blank" size="sm" className="text-blue-600 hover:underline">
                kamranmajid41@gmail.com
              </Anchor>
            </Box>
          </Group>
          <Group wrap="nowrap" align="center">
            <Linkedin size={24} className="text-blue-600" />
            <Box>
              <Text fw={500}>LinkedIn</Text>
              <Anchor href="https://www.linkedin.com/in/kamran-majid-0571121b0/" target="_blank" size="sm" className="text-blue-600 hover:underline">
                linkedin.com/in/kamran-majid
              </Anchor>
            </Box>
          </Group>
          <Group wrap="nowrap" align="center">
            <Github size={24} className="text-blue-600" />
            <Box>
              <Text fw={500}>GitHub</Text>
              <Anchor href="https://github.com/kamranmajid41?tab=repositories" target="_blank" size="sm" className="text-blue-600 hover:underline">
                github.com/kamranmajid41
              </Anchor>
            </Box>
          </Group>
          <Group wrap="nowrap" align="center">
            <PhoneIcon size={24} className="text-blue-600" />
            <Box>
              <Text fw={500}>Phone</Text>
              <Text size="sm" className="text-gray-700">
                {secureMode ? "Please sign in for phone #." :  "+1 (703) 345-8427"}
              </Text>
            </Box>
          </Group>
        </SimpleGrid>
       
      </Paper>
    ),
    initialPosition: [-0.6, -0.3 + 0.05 / 2 + 0.325, 0.05],
    selectedPosition: [-0.6, -0.3 + 0.05 / 2 + 0.325, 0.5],
    scale: [0.015, 0.015, 0.015],
    rotation: [Math.PI, 2 * Math.PI, 0]
  };

  // Define properties for the new papers object (now Resume)
  const singlePapers = {
    id: 'papers-1',
    title: 'Resume/CV',
    description: (
      <Box className="mt-4 flex flex-col items-center">
        <Paper shadow="sm" p="md" radius="md" withBorder className="w-full max-w-xl">
          <Document
            file='src/assets/Res_Kam.pdf' 
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            className="w-full h-full"
          >
            <Page pageNumber={pageNumber} width={Math.min(window.innerWidth * 0.7, 600)} /> {/* Adjust width dynamically */}
          </Document>
          <Group justify="center" mt="md">
            <Text size="sm" className="text-gray-700">
              Page {pageNumber} of {numPages}
            </Text>
            <Group>
              <Button onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} disabled={pageNumber <= 1}>
                Previous
              </Button>
              <Button onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))} disabled={pageNumber >= numPages}>
                Next
              </Button>
            </Group>
          </Group>
        </Paper>
        <Text size="sm" c="dimmed" className="mt-4 text-center">
          For a downloadable version, please contact me.
        </Text>
      </Box>
    ),
    initialPosition: [-0.1, -0.7 + 0.05 / 2 + 0.00, 0.05],
    selectedPosition: [-0.1, -0.7 + 0.05 / 2 + 0.00, 0.5],
    scale: [0.7, 0.7, 0.7],
    rotation: [0, -0.2, 0]
  };

  // Array of all objects for easier iteration and management
  const allObjects = [singleBook, singlePhone, singlePapers];

  // Handler for object clicks
  const handleObjectClick = (objectId) => {
    // If the clicked object is already selected, deselect it and close the drawer
    if (selectedObject === objectId) {
      setSelectedObject(null);
      close();
      setDrawerContent(null);
    } else {
      // Otherwise, select the new object and open the drawer with its details
      setSelectedObject(objectId);
      const objectInfo = allObjects.find(obj => obj.id === objectId);
      setDrawerContent(objectInfo);
      open();
    }
  };

  return (
    <>
      {/* Mantine Drawer for displaying object information */}
      <Drawer
        opened={opened}
        onClose={close}
        title={drawerContent ? drawerContent.title : ''}
        position="right"
        size="lg" // Increased size for better content display
        padding="md"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        zIndex={1000} // Ensure drawer is above the canvas
      >
        {drawerContent ? (
          <Box>
            {drawerContent.description} {/* Render the description directly */}
          </Box>
        ) : (
          <p className="text-gray-500">Select an object to see its details.</p>
        )}
      </Drawer>

      {/* Main 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 3], fov: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          background: '#1a1a1a'
        }}
      >
        <Suspense fallback={null}>
          {/* Environment for lighting and reflections */}
          <Environment preset="sunset" background blur={0.5} />

          {/* Directional light for main illumination and shadows */}
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {/* Additional lights for scene ambience */}
          <pointLight position={[-3, 2, 2]} intensity={0.8} />
          <ambientLight intensity={0.3} />

          {/* Render the Bookshelf */}
          <Bookshelf woodColor="#5C4033" />

          {/* Render the Phone Model */}
          <Phone
            initialPosition={singlePhone.initialPosition}
            selectedPosition={singlePhone.selectedPosition}
            scale={singlePhone.scale}
            rotation={singlePhone.rotation}
            onClick={() => handleObjectClick(singlePhone.id)}
            isSelected={selectedObject === singlePhone.id}
            title={singlePhone.title}
          />

          {/* Render the Book Model */}
          <BookModel
            initialPosition={singleBook.initialPosition}
            selectedPosition={singleBook.selectedPosition}
            rotation={singleBook.rotation}
            scale={singleBook.scale}
            onClick={() => handleObjectClick(singleBook.id)}
            isSelected={selectedObject === singleBook.id}
            title={singleBook.title}
          />

          {/* Render the Papers Model */}
          <Papers
            initialPosition={singlePapers.initialPosition}
            selectedPosition={singlePapers.selectedPosition}
            scale={singlePapers.scale}
            rotation={singlePapers.rotation}
            onClick={() => handleObjectClick(singlePapers.id)}
            isSelected={selectedObject === singlePapers.id}
            title={singlePapers.title}
          />

        </Suspense>

        {/* Contact shadows for realistic grounding */}
        <ContactShadows
          position={[0, -0.75, 0]}
          scale={10}
          far={1}
          blur={2}
          opacity={0.75}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* OrbitControls for camera interaction */}
        <OrbitControls makeDefault />

        {/* Post-processing effects for visual enhancement */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.9} height={300} />
          <DepthOfField focusDistance={0.0} focalLength={0.02} bokehScale={2} height={480} />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
          <ToneMapping adaptive={true} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default BookshelfScene;
