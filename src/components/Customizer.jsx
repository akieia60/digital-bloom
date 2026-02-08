import { useState, useRef, useEffect } from 'react';

const Customizer = ({ product, isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const audioRefA = useRef(null);
  const audioRefB = useRef(null);
  const [activeRef, setActiveRef] = useState('A');
  const [audioError, setAudioError] = useState(false);
  const [customization, setCustomization] = useState({
    message: '',
    sender: '',
    recipient: '',
    music: 'None',
    theme: 'Original'
  });

  const musicOptions = [
    { title: 'None', genre: 'Silent', vibe: 'Pure Visuals', file: null },
    { title: 'Lofi Glow', genre: 'Relaxing', vibe: 'Soft & Atmospheric', file: 'https://cdn.pixabay.com/audio/2022/01/21/audio_317429810b.mp3' }, // Placeholder high-quality lofi
    { title: 'Cinematic Bloom', genre: 'Epic', vibe: 'Grand & Inspiring', file: 'https://cdn.pixabay.com/audio/2022/03/15/audio_78331a6917.mp3' },
    { title: 'Romantic Piano', genre: 'Love', vibe: 'Heartfelt & Deep', file: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884583305a.mp3' },
    { title: 'Acoustic Soul', genre: 'Warm', vibe: 'Human & Personal', file: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a7315b.mp3' }
  ];

  useEffect(() => {
    const selectedMusic = musicOptions.find(m => m.title === customization.music);
    const targetRef = activeRef === 'A' ? audioRefB : audioRefA;
    const currentRef = activeRef === 'A' ? audioRefA : audioRefB;

    if (selectedMusic && selectedMusic.file) {
      targetRef.current.src = selectedMusic.file;
      targetRef.current.volume = 0;
      
      const playPromise = targetRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setAudioError(false);
          // Cross-fade
          let vol = 0;
          const interval = setInterval(() => {
            vol += 0.05;
            if (vol >= 1) {
              vol = 1;
              clearInterval(interval);
            }
            targetRef.current.volume = vol;
            if (currentRef.current) currentRef.current.volume = 1 - vol;
          }, 50);

          setActiveRef(activeRef === 'A' ? 'B' : 'A');
          setTimeout(() => {
            if (currentRef.current) {
              currentRef.current.pause();
              currentRef.current.src = '';
            }
          }, 1000);
        }).catch(e => {
          console.log("Audio play blocked", e);
          setAudioError(true);
        });
      }
    } else {
      // Fade out current
      let vol = currentRef.current ? currentRef.current.volume : 0;
      const interval = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          vol = 0;
          clearInterval(interval);
          if (currentRef.current) currentRef.current.pause();
        }
        if (currentRef.current) currentRef.current.volume = vol;
      }, 50);
    }
  }, [customization.music]);

  useEffect(() => {
    if (!isOpen) {
      if (audioRefA.current) audioRefA.current.pause();
      if (audioRefB.current) audioRefB.current.pause();
    }
  }, [isOpen]);

  const themeOptions = [
    { name: 'Original', label: 'Artisan Clarity', class: '' },
    { name: 'Obsidian Gold', label: 'Midnight Luxury', class: 'sepia-[0.5] hue-rotate-[10deg] saturate-[0.8] brightness-[0.9] contrast-[1.1]' },
    { name: 'Rose Quartz', label: 'Soft Petals', class: 'hue-rotate-[320deg] saturate-[1.2] brightness-[1.1]' },
    { name: 'Midnight Silver', label: 'Moonlight Gallery', class: 'grayscale-[0.8] brightness-[0.8] contrast-[1.2]' }
  ];

  if (!isOpen) return null;

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = () => {
    onComplete(customization);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-12 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={onClose}></div>

      {/* Customizer Drawer */}
      <div className="relative w-full max-w-4xl h-[90vh] sm:h-auto sm:aspect-[16/9] glass border-t sm:border border-white/10 rounded-t-3xl sm:rounded-[2.5rem] overflow-hidden flex flex-col sm:flex-row shadow-2xl animate-slide-up">
        
        {/* Left: Live Preview */}
        <div className="w-full sm:w-1/2 bg-black relative flex items-center justify-center overflow-hidden">
          <video
            src={product.video_file_url || product.video_url}
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-all duration-1000 ${themeOptions.find(t => t.name === customization.theme).class}`}
          />
          
          {/* Real-time Message Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 pointer-events-none">
            {customization.message && (
              <div className="glass px-8 py-6 rounded-2xl animate-fade-in max-w-xs">
                <p className="font-display text-white text-lg italic leading-relaxed">
                  "{customization.message}"
                </p>
                {customization.sender && (
                  <p className="text-[10px] uppercase tracking-widest text-pure-gold mt-4 font-semibold">
                    From {customization.sender}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="absolute top-8 left-8 flex flex-col space-y-2">
             <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium">Bespoke Preview</span>
             {audioError && customization.music !== 'None' && (
               <div className="flex items-center space-x-2 animate-pulse">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                 <span className="text-[8px] uppercase tracking-[0.2em] text-red-400 font-bold">Audio Permission Required</span>
               </div>
             )}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full sm:w-1/2 flex flex-col p-8 sm:p-12 bg-obsidian text-white overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-3xl font-medium font-display leading-tight mb-2">Personalize Your <br /> <span className="gradient-text">{product.name}</span></h2>
              <p className="text-white/40 text-xs tracking-widest uppercase">Step {step} of 3</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow">
            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-10">
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. For Kionna"
                      value={customization.recipient}
                      onChange={(e) => setCustomization({...customization, recipient: e.target.value})}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-pure-gold transition-colors text-lg font-light"
                    />
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block">Your Personal Note</label>
                    <textarea
                      placeholder="Write something heartfelt..."
                      value={customization.message}
                      onChange={(e) => setCustomization({...customization, message: e.target.value})}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-pure-gold transition-colors text-lg font-light resize-none h-24"
                    />
                  </div>
                  <div className="relative group">
                    <label className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block">Sender Name</label>
                    <input
                      type="text"
                      placeholder="e.g. From Akieia"
                      value={customization.sender}
                      onChange={(e) => setCustomization({...customization, sender: e.target.value})}
                      className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-pure-gold transition-colors text-lg font-light"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <label className="text-[10px] uppercase tracking-widest text-white/30 mb-6 block">Select Soundscape</label>
                <div className="grid grid-cols-2 gap-4">
                  {musicOptions.map((opt) => (
                    <button
                      key={opt.title}
                      onClick={() => setCustomization({...customization, music: opt.title})}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        customization.music === opt.title 
                          ? 'bg-pure-gold border-pure-gold text-black shadow-lg shadow-pure-gold/20' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <h4 className="text-sm font-semibold mb-1">{opt.title}</h4>
                      <p className={`text-[9px] uppercase tracking-[0.2em] font-medium ${customization.music === opt.title ? 'text-black/60' : 'text-white/30'}`}>
                        {opt.vibe}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <label className="text-[10px] uppercase tracking-widest text-white/30 mb-6 block">Luxury Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setCustomization({...customization, theme: opt.name})}
                      className={`p-6 rounded-2xl border text-left transition-all ${
                        customization.theme === opt.name 
                          ? 'bg-pure-gold border-pure-gold text-black shadow-lg shadow-pure-gold/20' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <h4 className="text-sm font-semibold mb-1">{opt.label}</h4>
                      <div className={`w-8 h-1 rounded-full ${customization.theme === opt.name ? 'bg-black/40' : 'bg-pure-gold/40'} mt-3`}></div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="mt-12 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={prevStep} className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-semibold">
                Back
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button onClick={nextStep} className="btn-primary px-12 py-4 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold">
                Continue
              </button>
            ) : (
              <button onClick={handleComplete} className="bg-pure-gold hover:bg-pure-gold/80 text-black px-12 py-4 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold transition-all shadow-lg shadow-pure-gold/30">
                Finalize & Buy 💎
              </button>
            )}
          </div>
        </div>
      </div>
      <audio ref={audioRefA} loop />
      <audio ref={audioRefB} loop />
    </div>
  );
};

export default Customizer;
