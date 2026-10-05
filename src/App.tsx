import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Phone, MapPin } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Preload, ContactShadows, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 1. Hanging Lamp
function HangingLamp({ position }: any) {
  return (
    <group position={position}>
      {/* Cord */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 8]} />
        <meshStandardMaterial color="#3F4D3A" />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.6, 0.8, 32]} />
        <meshStandardMaterial color="#55664E" roughness={0.8} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#D1923B" />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={1.5} color="#D1923B" distance={10} decay={2} />
    </group>
  );
}

// 2. Slatted Wall (Terracotta)
function SlattedWall({ position, rotation, scale }: any) {
  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.3} floatingRange={[-0.05, 0.05]} position={position}>
      <group rotation={rotation} scale={scale}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[i * 0.4 - 0.8, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.15, 7, 16]} />
            <meshStandardMaterial color="#D77348" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// 3. Background Capsule (Taupe)
function BackgroundCapsule({ position, scale, rotation }: any) {
  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4} floatingRange={[-0.1, 0.1]} position={position}>
      <mesh scale={scale} rotation={rotation} receiveShadow>
        <capsuleGeometry args={[1, 3, 32, 32]} />
        <meshStandardMaterial color="#A84F32" roughness={0.9} />
      </mesh>
    </Float>
  );
}

// 4. Textured Sphere (Dark Espresso)
function TexturedSphere({ position, scale }: any) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_state, delta) => {
    if (mesh.current) {
      // Continuous slow rotation like a planet
      mesh.current.rotation.y += delta * 0.1;
      mesh.current.rotation.x += delta * 0.05;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6} floatingRange={[-0.15, 0.15]} position={position}>
      <mesh ref={mesh} scale={scale} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#4A2D20" roughness={1} metalness={0} />
      </mesh>
    </Float>
  );
}

// 5. Abstract Plant (Dark Green)
function AbstractPlant({ position, rotation, scale }: any) {
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.1, 0.1]} position={position}>
      <group rotation={rotation} scale={scale}>
        {/* Stem */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 6, 16]} />
          <meshStandardMaterial color="#3F4D3A" roughness={0.8} />
        </mesh>
        {/* Leaf 1 */}
        <mesh position={[0.6, 1.5, 0]} rotation={[0, 0, -0.8]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.04, 32]} />
          <meshStandardMaterial color="#55664E" roughness={0.9} />
        </mesh>
        {/* Leaf 2 */}
        <mesh position={[-0.5, 0.5, 0.2]} rotation={[0.4, 0, 0.6]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.04, 32]} />
          <meshStandardMaterial color="#55664E" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

// 6. Deleted EndScene3D to reuse main Scene3D via glassmorphism transparency

// Premium Mouse Hover Parallax
function CameraRig() {
  useFrame((state) => {
    // Gently smoothly move the camera based on pointer position for a 3D hover effect
    const targetX = (state.pointer.x * state.viewport.width) / 10;
    const targetY = (state.pointer.y * state.viewport.height) / 10;
    
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// Custom SVG Icon to guarantee no import crashes
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
  </svg>
);

// 6. Unique 3D Scene for the Footer (Abstract Cafe Interior)
function EndScene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
      <CameraRig />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={2} color="#FFFFFF" castShadow />
      <directionalLight position={[-5, -2, -5]} intensity={2} color="#D77348" />
      <pointLight position={[-2, 4, 1]} intensity={1.5} color="#F2E8DA" />
      
      {/* Crucial for metallic materials to reflect properly instead of appearing pitch black */}
      <Environment preset="studio" />
      
      {/* 1. Barista Counter (Dark Marble/Stone) */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1} position={[2, -4, 0]}>
        <mesh rotation={[0, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 4, 3]} />
          <meshStandardMaterial color="#3F4D3A" roughness={0.1} metalness={0.7} />
        </mesh>
      </Float>

      {/* 2. Abstract Espresso Machine / Object on Bar */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2} position={[1, -1.5, 1]}>
        <group rotation={[0, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 1.8, 1]} />
            <meshStandardMaterial color="#A84F32" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 1, 0.6]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
      </Float>

      {/* 3. Massive Circular Bronze Mirror */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2} position={[-3, 1, -3]}>
        <mesh rotation={[1.57, 0, 0]} receiveShadow>
          <cylinderGeometry args={[3, 3, 0.2, 64]} />
          <meshStandardMaterial color="#D1923B" roughness={0.1} metalness={1} />
        </mesh>
      </Float>

      {/* 4. Slatted Wood Wall Segment */}
      <Float speed={1} rotationIntensity={0.02} floatIntensity={0.1} position={[-5, -1, -5]}>
        <group rotation={[0, 0.5, 0]}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <mesh key={i} position={[i * 0.8, 0, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 14, 16]} />
              <meshStandardMaterial color="#4A2D20" roughness={0.8} />
            </mesh>
          ))}
        </group>
      </Float>

      {/* 5. Hanging Pendant Light */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3} position={[2, 4, 1]}>
        <group>
          {/* Wire */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
            <meshBasicMaterial color="#3F4D3A" />
          </mesh>
          {/* Shade */}
          <mesh position={[0, 0, 0]} castShadow>
            <coneGeometry args={[1, 1.5, 32]} />
            <meshStandardMaterial color="#55664E" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Bulb */}
          <mesh position={[0, -0.7, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#D1923B" />
          </mesh>
        </group>
      </Float>

      <Preload all />
    </Canvas>
  );
}

// Exact Recreation of the Reference 3D Scene
function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial width on mount
    setIsMobile(window.innerWidth < 768);
    
    // Add resize listener
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <CameraRig />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 5, -5]} intensity={1} color="#FFF0D4" />
        <Environment preset="studio" />
        
        {/* Atmospheric Dust / Sugar Particles */}
        <Sparkles count={80} scale={12} size={1.5} speed={0.1} opacity={0.3} color="#E8D1B5" />
        
        {/* Floor Shadow */}
        <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={20} blur={2.5} far={10} color="#272727" />
        
        {/* Base Scene Composition - Fully Responsive */}
        
        {/* Background Taupe Capsule */}
        <BackgroundCapsule 
          position={isMobile ? [0.2, 0, -5] : [1, 0, -5]} 
          scale={isMobile ? [1.8, 1.8, 1.8] : [2.5, 2.5, 2.5]} 
          rotation={[0, 0, 0]} 
        />
        
        {/* Left Terracotta Slatted Wall */}
        <SlattedWall 
          position={isMobile ? [-1.2, -0.5, -2] : [-2, -0.5, -2]} 
          rotation={[0, 0, 0]} 
          scale={isMobile ? [0.8, 0.8, 0.8] : [1, 1, 1]} 
        />
        
        {/* Top Left Hanging Lamp */}
        <HangingLamp 
          position={isMobile ? [-1, 3.5, 0] : [-1.5, 3.5, 0]} 
        />
        
        {/* Bottom Left Dark Espresso Sphere */}
        <TexturedSphere 
          position={isMobile ? [-0.6, -2.5, 1] : [-1.2, -2.5, 1]} 
          scale={isMobile ? [1.2, 1.2, 1.2] : [1.8, 1.8, 1.8]} 
        />
        
        {/* Right Abstract Plant */}
        <AbstractPlant 
          position={isMobile ? [1.4, -1, 0] : [3, -1, 0]} 
          rotation={[0, 0, 0.1]} 
          scale={isMobile ? [0.6, 0.6, 0.6] : [1, 1, 1]} 
        />

        <Preload all />
      </Canvas>
    </div>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const menuImages = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    document.getElementById('home-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-[#FFFFF0] selection:bg-[#CC5641]/20 text-[#272727] scroll-smooth">
      {/* 3D Real-time Scene overlay - FIXED in background */}
      {/* <Scene3D /> */}

      {/* Loading Screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFFFF0]"
            exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
          >
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <span className="font-serif text-[#272727]/40 tracking-[0.5em] text-xs uppercase">Loading</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="relative z-10 w-full flex flex-col">
        
        {/* ======================= HOME SECTION ======================= */}
        <section id="home-section" className="w-full min-h-screen relative bg-[#FFFFF0] overflow-hidden z-20 cursor-pointer" onClick={scrollToMenu}>
          
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
            src="/Images/bg video brown sugar caffe.mp4"
          />

          {/* Overlay to ensure smooth transition (optional) */}
          <div className="absolute inset-0 bg-[#FFFFF0]/10 z-0 pointer-events-none mix-blend-overlay"></div>

          {/* 100% Visible Dark Button */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            <button 
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering the section click twice
                scrollToMenu();
              }}
              className="bg-[#1a1412] text-[#FFFFF0] px-10 py-4 rounded-full flex items-center gap-3 hover:bg-[#3d2f25] transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/10 active:scale-95"
            >
              <span className="font-sans tracking-[0.2em] text-[0.75rem] md:text-[0.85rem] uppercase font-extrabold">
                Explore Menu
              </span>
              <span className="text-sm font-bold">↓</span>
            </button>
          </div>
        </section>

        {/* ======================= MENU SECTION ======================= */}
        {/* Solid background added to make the menu section plain and hide the 3D behind it */}
        <section id="menu-section" className="w-full flex flex-col items-center pt-16 md:pt-24 pb-12 z-20 bg-[#FFFFF0] relative">
          <div className="text-center mb-12 pointer-events-none">
            <h2 className="font-serif text-2xl md:text-3xl text-[#272727] tracking-wide font-bold drop-shadow-md">
              OUR <span className="text-[#CC5641]">MENU</span>
            </h2>
            <p className="font-sans text-[#272727]/50 tracking-[0.2em] text-[0.6rem] uppercase mt-4">Tap any image to swipe</p>
          </div>

          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-8 px-4">
            {menuImages.map((num, idx) => (
              <div 
                key={num} 
                className="w-full relative group cursor-pointer"
                onClick={() => setLightboxIndex(idx)}
              >
                <div className="w-full h-auto rounded-[8px] overflow-hidden relative shadow-[0_30px_60px_rgba(39,39,39,0.15)] transition-transform duration-700 bg-white border border-[#272727]/5 group-hover:scale-[1.02]">
                  <img 
                    src={`/Images/0${num}.png`} 
                    alt={`Menu Page ${num}`} 
                    className="w-full h-auto object-contain block"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================= END SECTION ======================= */}
        <section id="end-section" className="w-full min-h-screen flex flex-col justify-start items-center relative bg-[#FFFFF0] overflow-hidden z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-t border-[#272727]/5" style={{ backgroundImage: "url('/Images/Thank you bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          
          {/* Unique Footer 3D Background */}
          {/* <div className="absolute inset-0 z-0 pointer-events-none">
            <EndScene3D />
          </div> */}

          {/* Top Spacer */}
          <div className="w-full h-[30vh] md:h-[35vh] z-10 shrink-0"></div>

          {/* Center Content */}
          <div className="flex flex-col items-center text-center z-10 w-full px-8 shrink-0">
            <img 
              src="/Images/bg original.png" 
              alt="Logo" 
              className="w-48 md:w-64 mb-10" 
            />

            <h2 className="font-serif text-[4rem] md:text-[7rem] leading-[0.9] text-[#272727] font-medium tracking-wide mb-6">
              THANK<br/>
              <span className="text-[#CC5641]">YOU</span>
            </h2>
            
            <p className="font-sans text-[#272727] tracking-[0.2em] text-[0.65rem] md:text-[0.75rem] uppercase leading-relaxed max-w-[300px] md:max-w-md font-bold bg-[#FFFFF0]/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#FFFFF0]/50">
              We hope you enjoyed your fusion experience.
            </p>

            <div className="mt-6 flex flex-col items-center gap-2 font-sans text-[#272727] tracking-[0.1em] text-[0.6rem] md:text-[0.7rem] leading-relaxed text-center font-bold bg-[#FFFFF0]/70 backdrop-blur-md px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#FFFFF0]/50 max-w-[90%] md:max-w-md">
              <div className="flex flex-col items-center justify-center gap-1 mb-2">
                <span className="uppercase tracking-[0.15em] text-[#272727]">Datta Prime Business Centre</span>
                <span className="uppercase text-[#272727]/80 font-medium">Beside Dominos, Mulgund Road, Gadag</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[#CC5641]">
                <Phone size={12} />
                <span className="text-[#272727]">8884909098, 9886031113</span>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-8">
              <a 
                href="https://www.instagram.com/brownsugarfusioncafe/?hl=en" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-[#272727] hover:text-[#CC5641] transition-colors duration-300 group bg-[#FFFFF0]/70 backdrop-blur-md px-6 py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#FFFFF0]/50"
              >
                <div className="p-2 border border-[#272727]/20 rounded-full group-hover:border-[#CC5641] transition-colors duration-300 bg-white/50">
                  <InstagramIcon />
                </div>
                <span className="font-sans tracking-[0.15em] text-[0.7rem] uppercase font-bold">Follow Us on Instagram</span>
              </a>

              <button 
                onClick={scrollToTop}
                className="mt-4 bg-[#272727] text-[#FFFFF0] px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#111] transition-all duration-300 shadow-xl shadow-black/10 active:scale-95 font-bold"
              >
                <ArrowLeft size={14} className="rotate-90" />
                <span className="font-sans tracking-[0.15em] text-[0.7rem] uppercase">Back to Top</span>
              </button>
            </div>
          </div>

          {/* Flex spacer to push footer down */}
          <div className="flex-1 w-full"></div>

          {/* Bottom Credits */}
          <div className="w-full z-10 border-t border-[#FFFFF0]/10 p-6 flex flex-col lg:flex-row justify-between items-center gap-4 bg-[#272727] shrink-0 font-['Montserrat']">
            <div className="text-[#FFFFF0]/50 tracking-[0.15em] text-[0.6rem] md:text-[0.65rem] uppercase font-medium">
              © {new Date().getFullYear()} Brown Sugar Fusion Cafe
            </div>
            
            <div className="text-[#FFFFF0]/70 tracking-[0.15em] text-[0.6rem] md:text-[0.65rem] uppercase flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left font-medium">
              <span>
                Designed & Developed by{' '}
                <a 
                  href="https://deepcipher-studio.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#CC5641] hover:text-white transition-colors font-bold underline underline-offset-4"
                >
                  DeepCipher
                </a>
              </span>
              <span className="hidden md:inline text-[#FFFFF0]/20">|</span>
              <span className="font-semibold text-[#FFFFF0]/90">Agency Contact: +91 9187360830</span>
            </div>
          </div>
        </section>

      </main>

      {/* ======================= LIGHTBOX SWIPER ======================= */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-[#111111] flex flex-col"
          >
            {/* Lightbox Header with Close Button */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
              <button 
                onClick={() => setLightboxIndex(null)}
                className="text-[#FFFFF0]/70 p-2 md:p-4 hover:text-white transition-all focus:outline-none hover:rotate-90 hover:scale-110 duration-500"
              >
                <X strokeWidth={1} size={40} />
              </button>
            </div>
            
            {/* Lightbox Swiper */}
            <div className="w-full h-full flex items-center justify-center">
              <Swiper
                initialSlide={lightboxIndex}
                navigation={true}
                pagination={{ type: 'fraction' }}
                keyboard={{ enabled: true }}
                modules={[Navigation, Pagination, Keyboard]}
                className="w-full h-full"
              >
                {menuImages.map((num) => (
                  <SwiperSlide key={num} className="box-border w-full h-full overflow-y-auto overflow-x-hidden px-12 md:px-24 py-20">
                    <div className="w-full min-h-full flex flex-col items-center justify-center">
                      <img 
                        src={`/Images/0${num}.png`} 
                        alt={`Menu Page ${num}`} 
                        className="w-full h-auto max-w-full md:max-w-3xl mx-auto drop-shadow-2xl rounded-sm"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            
            {/* Swiper Custom CSS overrides for Lightbox */}
            <style>{`
              .swiper-button-next, .swiper-button-prev {
                color: rgba(241, 234, 221, 0.7) !important;
                background: transparent !important;
                backdrop-filter: none;
                box-shadow: none;
                border-radius: 0 !important;
                width: auto !important;
                height: auto !important;
                top: 50% !important;
                bottom: auto !important;
                margin-top: 0 !important;
                transform: translateY(-50%) !important;
                transition: all 0.3s ease;
              }
              .swiper-button-next::after, .swiper-button-prev::after {
                font-size: 28px !important;
                font-weight: 300 !important;
              }
              .swiper-button-prev { left: 10px !important; }
              .swiper-button-next { right: 10px !important; }
              .swiper-button-next:hover, .swiper-button-prev:hover {
                background: transparent !important;
                color: #ffffff !important;
                transform: translateY(-50%) scale(1.2) !important;
              }
              .swiper-pagination-fraction {
                color: rgba(241, 234, 221, 0.5) !important;
                font-family: var(--font-sans);
                letter-spacing: 0.3em;
                font-size: 0.7rem;
                bottom: 24px !important;
                font-weight: 400;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
