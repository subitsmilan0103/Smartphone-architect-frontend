import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, RoundedBox } from '@react-three/drei'

const COLORS = [
  { name: 'Silver', frame: '#8a8885', back: '#9c9c9c' },
  { name: 'Black', frame: '#232426', back: '#1b1b1c' },
  { name: 'Glacier', frame: '#9de7ff', back: '#aaeeff' },
  { name: 'Burgundy', frame: '#360000', back: '#4e0006' },
]

function CameraCutout({ type, height }) {
  const topY = height/2;
  const zPos = 0.005;

  if (type === 'holepunch') {
    return (
      <mesh position={[0, topY-0.35, zPos]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="black" />
      </mesh>
    );
  }
  if (type === 'notch') {
    return (
      <RoundedBox args={[1.0, 0.3, 0.00]} radius={0.1} position={[0, topY-0.15, zPos]}>
        <meshBasicMaterial color="black" />
      </RoundedBox>
    );
  }
  if (type === 'island') {
    return (
      <RoundedBox args={[0.85, 0.22, 0.11]} radius={0.11} position={[0, topY-0.3, zPos]}>
        <meshBasicMaterial color="black" />
      </RoundedBox>
    );
  }
  return null;
}


function DetailedLens({ position }) {
  return (
    <group position={position}>
      {/* kulso femgyuru */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 32]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* szenzor */}
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
        <meshStandardMaterial color="#020813" metalness={0.9} roughness={0.05} />
      </mesh>

      {/* vedouveg  */}
      <mesh position={[0, 0, -0.06]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.95} 
          opacity={1} 
          transparent 
          roughness={0.05} 
          ior={1.5} 
        />
      </mesh>
    </group>
  )
}

function Phone({ width, height, thickness, cutoutType, selectedColor, cornerRadius }) {
  return (
    <group>
      {/* keret */}
      <RoundedBox args={[width, height, thickness, cornerRadius]} radius={cornerRadius} smoothness={8}>
        <meshStandardMaterial 
          color={selectedColor.frame} 
          metalness={0.85} 
          roughness={0.25} 
        />
      </RoundedBox>

      {/* hatlapi uveg */}
      <mesh position={[0, 0, -thickness/2 - 0.002]}>
        <planeGeometry args={[width-0.08, height-0.08]} />
        <meshStandardMaterial 
          color={selectedColor.back} 
          roughness={0.65} 
          metalness={0.1} 
        />
      </mesh>

      {/* kijelzo */}
      <group position={[0, 0, thickness/2 + 0.003]}>
        <mesh>
          <planeGeometry args={[width-0.12, height-0.12]} />
          <meshStandardMaterial color="#020202" roughness={0.1} metalness={0.8} />
        </mesh>

        <CameraCutout type={cutoutType} height={height} />
      </group>

      {/* kamerasziget */}
      <group position={[-width/2 + 0.8, height/2 - 0.85, -thickness/2 - 0.03]}>
        <RoundedBox args={[1.3, 1.4, 0.06]} radius={0.2} smoothness={6}>
          <meshPhysicalMaterial 
            color={selectedColor.back} 
            transmission={0.4} 
            roughness={0.2} 
            metalness={0.1} 
          />
        </RoundedBox>
        
        <DetailedLens position={[0, 0.32, -0.04]} />
        <DetailedLens position={[0, -0.32, -0.04]} />
      </group>
    </group>
  )
}
function App() {
  // allapotok a meretek tarolasara (alapertekekkel)
  const [step, setStep] = useState(1);
  const [width, setWidth] = useState(3.2);
  const [height, setHeight] = useState(6.8);
  const [thickness, setThickness] = useState(0.35);
  const [cornerRadius, setCornerRadius] = useState(0.22);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [cutoutType, setCutoutType] = useState('holepunch');

  const maxAllowedRadius = Math.min(width, height, thickness)/2 - 0.005;
  const safeCornerRadius = Math.min(cornerRadius, maxAllowedRadius);

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#121212', margin: 0, padding: 0 }}>
      
      {/* vezerlopult */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, color: 'white', 
        fontFamily: 'sans-serif', zIndex: 10, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '20px', borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)', width: '280px',
        backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* lepes fejlec */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontWeight: 700, color: step === 1 ? '#0071e3' : '#666' }}>1. Sizes</span>
          <span style={{ color: '#444' }}>➔</span>
          <span style={{ fontWeight: 700, color: step === 2 ? '#0071e3' : '#666' }}>2. Materials & Details</span>
        </div>

        {/* 1. lepes: meretek csuszkai */}
        {step === 1 && (
          <div>
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: 0 }}>Set the dimensions of the phone before adding components.</p>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.85rem' }}>Width: {width.toFixed(2)}</label>
              <input type="range" min="2.6" max="4.0" step="0.05" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} style={{ width: '100%', marginTop: '4px' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.85rem' }}>Height: {height.toFixed(2)}</label>
              <input type="range" min="5.5" max="7.5" step="0.05" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} style={{ width: '100%', marginTop: '4px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem' }}>Thickness: {thickness.toFixed(2)}</label>
              <input type="range" min="0.25" max="0.6" step="0.02" value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))} style={{ width: '100%', marginTop: '4px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem' }}>Roundedness:</label>
              <input type="range" min="0.02" max={maxAllowedRadius} step="0.01" value={cornerRadius} onChange={(e) => setCornerRadius(parseFloat(e.target.value))} style={{ width: '100%', marginTop: '4px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#666' }}>
                <span>Less rounded</span>
                <span>More rounded</span>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '10px', backgroundColor: '#0071e3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Fix size and continue
            </button>
          </div>
        )}

        {/* 2. lepes: anyag, szin, kamera valasztas */}
        {step === 2 && (
          <div>
            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Materials & Colors:</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {COLORS.map((c) => (
                <div 
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: c.frame, cursor: 'pointer',
                    border: selectedColor.name === c.name ? '2px solid #0071e3' : '2px solid transparent',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                  }}
                  title={c.name}
                />
              ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem' }}>Display Cutout:</label>
              <select 
                value={cutoutType} 
                onChange={(e) => setCutoutType(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '6px', backgroundColor: '#1a1f2c', color: 'white', border: '1px solid #333', borderRadius: '6px' }}
              >
                <option value="holepunch">Hole Punch</option>
                <option value="notch">Notch</option>
                <option value="island">Dynamic Island</option>
                <option value="none">Hidden</option>
              </select>
            </div>

            <button 
              onClick={() => setStep(1)}
              style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#999', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' }}
            >
              Back to Sizes
            </button>
          </div>
        )}

      </div>

      <Canvas camera={{ position: [0,0,9] }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5,10,5]} intensity={2.5} />
        <directionalLight position={[-5,-5,-5]} intensity={0.8} color="#ffffff" />
        
        <Environment preset="studio" />
        
        <Phone 
          width={width} 
          height={height} 
          thickness={thickness} 
          cutoutType={cutoutType} 
          selectedColor={selectedColor}
          cornerRadius={cornerRadius}
        />
        
        <OrbitControls makeDefault enablePan={false} />
      </Canvas>
    </div>
  )
}

export default App