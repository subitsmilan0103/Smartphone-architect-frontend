import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

function PhoneChassis({ width, height, thickness }) {
  return (
    <mesh>
      <boxGeometry args={[width, height, thickness]} /> 
      <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
    </mesh>
  )
}

function App() {
  // allapotok a meretek tarolasara (alapertekekkel)
  const [width, setWidth] = useState(3.0);
  const [height, setHeight] = useState(6.5);
  const [thickness, setThickness] = useState(0.4);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#121212', margin: 0, padding: 0 }}>
      
      {/* vezerlopult */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, color: 'white', 
        fontFamily: 'sans-serif', zIndex: 10, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '20px', borderRadius: '12px' 
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>Smartphone Architect</h2>
        
        {/* szelesseg csuszka */}
        <div style={{ marginBottom: '15px' }}>
          <label>Width: {width.toFixed(2)}</label><br />
          <input 
            type="range" min="2.0" max="4.5" step="0.1" 
            value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>

        {/* magassag csuszka */}
        <div style={{ marginBottom: '15px' }}>
          <label>Height: {height.toFixed(2)}</label><br />
          <input 
            type="range" min="4.0" max="8.0" step="0.1" 
            value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>


        {/* vastagsag csuszka */}
        <div style={{ marginBottom: '15px' }}>
          <label>Thickness: {thickness.toFixed(2)}</label><br />
          <input 
            type="range" min="0.1" max="1.5" step="0.05" 
            value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* 3D motor */}
      <Canvas camera={{ position: [0,0,10] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5,5,5]} intensity={2} />
        <Environment preset="city" />
        
        <PhoneChassis width={width} height={height} thickness={thickness} />
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}

export default App