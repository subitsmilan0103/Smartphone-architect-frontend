import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, RoundedBox } from '@react-three/drei'

function CameraCutout({ type, height }) {
  const topY = height/2;
  const zPos = 0.01;

  if (type === 'holepunch') {
    return (
      <mesh position={[0, topY-0.4, zPos]}>
        <circleGeometry args={[0.1, 32]} />
        <meshBasicMaterial color="black" />
      </mesh>
    );
  }
  if (type === 'notch') {
    return (
      <RoundedBox args={[0.8, 0.4, 0.02]} radius={0.1} position={[0, topY-0.2, zPos]}>
        <meshBasicMaterial color="black" />
      </RoundedBox>
    );
  }
  if (type === 'island') {
    return (
      <RoundedBox args={[0.9, 0.25, 0.02]} radius={0.125} position={[0, topY-0.4, zPos]}>
        <meshBasicMaterial color="black" />
      </RoundedBox>
    );
  }
  return null;
}

function CameraBump({ width, height, thickness }) {
  // A bal felső sarokba (x, y) és a hátlapra (-z) pozicionáljuk
  return (
    <group position={[-width/2 + 0.7, height/2 - 0.8, -thickness/2 - 0.05]}>
      {/* kamerasziget */}
      <RoundedBox args={[1.2, 1.4, 0.1]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
      </RoundedBox>
      
      {/* egyik lencse */}
      <mesh position={[0, 0.3, -0.05]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 32]} />
        <meshStandardMaterial color="#000" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* masik lencse */}
      <mesh position={[0, -0.3, -0.05]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 32]} />
        <meshStandardMaterial color="#000" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

function PhoneChassis({ width, height, thickness, cutoutType  }) {
  return (
    <group>
      {/* vaz */}
      <RoundedBox args={[width, height, thickness]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#a0b3c6" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      {/* kijelzo */}
      <group position={[0, 0, thickness/2 + 0.005]}>
        {/* panel */}
        <RoundedBox args={[width-0.15, height-0.15, 0.01]} radius={0.15} smoothness={4}>
          <meshBasicMaterial color="#050505" />
        </RoundedBox>
        
        {/* kivagas */}
        <CameraCutout type={cutoutType} height={height-0.15} />
      </group>

      {/* hatlapi kamerak */}
      <CameraBump width={width} height={height} thickness={thickness} />
    </group>
  );
}

function App() {
  // allapotok a meretek tarolasara (alapertekekkel)
  const [width, setWidth] = useState(3.2);
  const [height, setHeight] = useState(6.8);
  const [thickness, setThickness] = useState(0.35);
  const [cutoutType, setCutoutType] = useState('holepunch'); // 'holepunch', 'notch', 'island'

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#121212', margin: 0, padding: 0 }}>
      
      {/* vezerlopult */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, color: 'white', 
        fontFamily: 'sans-serif', zIndex: 10, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '20px', borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)', width: '280px'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#64ffda' }}>Smartphone Architect</h2>
        
        {/* szelesseg csuszka */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.9rem' }}>Width: {width.toFixed(2)}</label><br />
          <input 
            type="range" min="2.5" max="4.5" step="0.05" 
            value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>

        {/* magassag csuszka */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.9rem' }}>Height: {height.toFixed(2)}</label><br />
          <input 
            type="range" min="5.0" max="8.0" step="0.05" 
            value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>


        {/* vastagsag csuszka */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.9rem' }}>Thickness: {thickness.toFixed(2)}</label><br />
          <input 
            type="range" min="0.15" max="1.0" step="0.05" 
            value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>

        {/* kivagas tipusa */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '0.9rem' }}>Front-facing camera:</label><br />
          <select 
            value={cutoutType} 
            onChange={(e) => setCutoutType(e.target.value)}
            style={{ width: '100%', padding: '5px', marginTop: '5px', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
          >
            <option value="none">Hidden</option>
            <option value="holepunch">Hole-punch</option>
            <option value="notch">Notch</option>
            <option value="island">Dynamic Island</option>
          </select>
        </div>
      </div>

      {/* 3D motor */}
      <Canvas camera={{ position: [0,0,10] }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5,5,5]} intensity={2.5} />
        <Environment preset="city" />
        
        <PhoneChassis width={width} height={height} thickness={thickness} cutoutType={cutoutType} />
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}

export default App