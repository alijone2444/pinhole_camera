import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function App() {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const [distance, setDistance] = useState(5);
  const [focalLength, setFocalLength] = useState(75);
  const [magnification, setMagnification] = useState(0);

  const handleFocalLengthChange = (event) => {
    // Update the focal length based on input
    setFocalLength(parseInt(event.target.value, 10));
  };

  const handleDistanceChange = (event) => {
    // Update the distance based on input
    setDistance(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    // Calculate magnification using the formula M = f/u
    const currentMagnification = focalLength / distance;
    setMagnification(currentMagnification);

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      focalLength,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();

    // Set the renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Append the renderer to the DOM
    const container = document.getElementById('app');
    container.appendChild(renderer.domElement);
    containerRef.current = container;

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Set the initial camera position
    camera.position.z = distance;

    // Assign the camera to the ref
    cameraRef.current = camera;

    // Handle scroll events
    const handleScroll = (event) => {
      // Adjust the camera position based on scroll direction
      setDistance((prevDistance) => prevDistance + event.deltaY * 0.01);

      // Limit the camera position to prevent going too far inside or outside
      setDistance((prevDistance) => Math.max(1, Math.min(10, prevDistance)));
    };

    // Add event listeners for mousewheel or touchpad scrolling
    document.addEventListener('wheel', handleScroll);

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Update camera properties
      camera.position.z = distance;
      camera.fov = focalLength;

      // Update the camera projection matrix after changing properties
      camera.updateProjectionMatrix();

      // Render the scene with the camera
      renderer.render(scene, camera);
    };

    // Start the animation
    animate();

    // Clean up on component unmount
    return () => {
      // Remove the event listener
      document.removeEventListener('wheel', handleScroll);

      // Remove the renderer from the DOM
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [distance, focalLength]);

  return (
    <div id="app" className="App">
      <div>
        <div>
          <label>Distance: {distance.toFixed(2)}</label>
          <input
            type="range"
            min="1"
            max="10"
            step="0.01"
            value={distance}
            onChange={handleDistanceChange}
          />
        </div>
        <div>
          <label>Focal Length:</label>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={focalLength}
            onChange={handleFocalLengthChange}
          />
          <span>Focal Length: {focalLength}</span>
        </div>
        <div>
          <label>Magnification:</label>
          <span>{magnification.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
