
import React from 'react';
import { motion } from 'framer-motion';
import SatyaLogo from './SatyaLogo';

interface HeroProps {
  onStartScan: () => void;
  onViewDashboard: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartScan, onViewDashboard }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col gap-20 pb-10 w-full max-w-[1800px] mx-auto">
      {/* --- HERO HEADER SECTION --- */}
      <section className="min-h-[calc(100vh-100px)] flex items-center justify-center relative overflow-hidden py-12 rounded-3xl bg-white/[0.02] border border-white/5 mt-2">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none rounded-3xl">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[600px] bg-cyber/10 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-neon/10 rounded-full blur-[80px] md:blur-[120px]" />
        </div>

        <div className="w-full px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 max-w-7xl mx-auto">
          
          {/* Text Content - Left Side on Desktop */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center lg:items-start w-full"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cyber/30 bg-cyber/5 text-cyber text-[10px] md:text-xs font-mono tracking-widest uppercase">
                Welcome to SATYASCAN
              </div>
              
              {/* Main Title - Reverted to Stacked/Column layout */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-mono font-bold tracking-tighter mb-8 leading-tight drop-shadow-lg flex flex-col items-center lg:items-start">
                 <div className="mb-4">
                    <SatyaLogo className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
                 </div>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber via-white to-neon">
                   SATYA<span className="text-white">SCAN</span>
                 </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-blue-200 mb-10 max-w-xl leading-relaxed">
                The ultimate AI-powered authenticity verification system. 
                Protect your skin and wallet by detecting counterfeits instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mb-12">
                <button 
                  onClick={onStartScan}
                  className="px-8 py-4 bg-gradient-to-r from-cyber/20 to-neon/20 border border-cyber text-cyber font-mono font-bold rounded-xl hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all duration-300 backdrop-blur-sm text-sm md:text-lg group"
                >
                  START SCAN <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </button>
                <button 
                  onClick={onViewDashboard}
                  className="px-8 py-4 bg-transparent border border-white/10 text-white font-mono rounded-xl hover:bg-white/5 transition-all duration-300 text-sm md:text-lg"
                >
                  VIEW STATS
                </button>
              </div>
            </motion.div>
          </div>

          {/* Graphic Section - Right Side on Desktop */}
          <motion.div 
            className="flex items-center justify-center lg:justify-end relative w-full order-2"
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Animated Graphic Placeholder */}
            <div className="w-72 h-80 sm:w-80 sm:h-96 md:w-[380px] md:h-[460px] relative glass-panel rounded-2xl p-3 border border-cyber/30 neon-glow flex items-center justify-center transform transition-all duration-500 hover:scale-[1.02] bg-black/20">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop')] opacity-20 bg-cover bg-center rounded-2xl mix-blend-overlay"></div>
               <div className="scan-line top-[20%]"></div>
               
               <div className="text-center z-10">
                  <div className="text-6xl md:text-7xl mb-5 filter drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] animate-pulse-fast">🛡️</div>
                  <div className="font-mono text-cyber text-xs md:text-sm tracking-[0.2em] font-bold mb-3">VERIFIED AUTHENTIC</div>
                  <div className="text-[10px] md:text-xs text-white/60 font-mono bg-black/60 px-4 py-1.5 rounded-full border border-white/10 inline-block backdrop-blur-md">
                    We Secure Your Skin
                  </div>
               </div>
               
               {/* Tech Corners */}
               <div className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 border-t-2 border-l-2 border-cyber rounded-tl-xl" />
               <div className="absolute top-0 right-0 w-8 h-8 md:w-10 md:h-10 border-t-2 border-r-2 border-cyber rounded-tr-xl" />
               <div className="absolute bottom-0 left-0 w-8 h-8 md:w-10 md:h-10 border-b-2 border-l-2 border-cyber rounded-bl-xl" />
               <div className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 border-b-2 border-r-2 border-cyber rounded-br-xl" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="w-full px-4 md:px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8"
        >
          {[
            { icon: "🔍", title: "Micro-Detail Analysis", desc: "Our ML analyzes packaging micro-textures, font kernels, and logo alignment to detect flaws invisible to the human eye." },
            { icon: "🦠", title: "Ingredient Safety", desc: "Counterfeits often contain dangerous chemicals like mercury or lead. SatyaScan identifies suspicious ingredient lists instantly." },
            { icon: "⚖️", title: "Brand Protection", desc: "Seamless integration with our secure in-house database ensures accurate batch-code verification and allows effortless one-click reporting for suspected fake products." }
          ].map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="glass-panel p-8 xl:p-10 rounded-2xl border border-white/5 hover:border-cyber/30 transition-all group hover:-translate-y-2">
              <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-xl bg-cyber/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl xl:text-2xl font-bold font-mono mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm xl:text-base leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="w-full px-4 md:px-6 py-10 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-mono font-bold mb-4">HOW IT WORKS</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyber to-neon mx-auto rounded-full"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-16 relative z-10">
            {[
              { step: "01", title: "Upload Image", desc: "Take a clear photo of the product packaging or bottle." },
              { step: "02", title: "AI Scanning", desc: "ML analyzes 5,000+ data points for authenticity markers." },
              { step: "03", title: "Instant Result", desc: "Get a confidence score and report fakes immediately." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center text-center bg-darkbg p-6 rounded-2xl border border-white/5 md:border-none shadow-xl md:shadow-none"
              >
                <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-cyber to-neon flex items-center justify-center font-mono font-bold text-black text-xl xl:text-2xl mb-6 shadow-[0_0_20px_rgba(0,229,255,0.4)] relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 max-w-[250px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="text-center py-10">
        <div className="glass-panel w-full max-w-4xl mx-auto p-10 rounded-[30px] border border-white/10 mx-4 bg-gradient-to-b from-white/5 to-transparent">
          <h2 className="text-3xl font-bold mb-4">Ready to verify?</h2>
          <p className="text-gray-300 mb-8 text-lg">Become part of a growing community protecting their skin from unsafe counterfeit products.</p>
          <button 
            onClick={onStartScan}
            className="px-10 py-4 bg-white text-black font-bold font-mono rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 text-lg"
          >
            START SCAN NOW
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
