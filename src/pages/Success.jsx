import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus } from '../lib/supabase';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPurchase = async () => {
      if (!sessionId) {
        setError('Session token unavailable.');
        setIsProcessing(false);
        return;
      }

      try {
        const updatedPurchase = await updatePurchaseStatus(sessionId, 'completed', {
          stripe_session_id: sessionId
        });
        if (updatedPurchase) setPurchase(updatedPurchase);
      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Failed to securely process acquisition.');
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-pure-gold/20 border-t-pure-gold rounded-full animate-spin mx-auto mb-8"></div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Publishing Your Experience</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center p-6 text-center">
        <div className="max-w-md glass border border-red-500/20 p-12 rounded-[2.5rem]">
          <h2 className="text-2xl font-display text-white mb-6">Acquisition Error</h2>
          <p className="text-white/40 font-light mb-8 text-sm italic">"{error}"</p>
          <Link to="/" className="btn-secondary px-8 py-3 rounded-full text-[10px] uppercase tracking-widest">Return to Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-3xl w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          {/* Animated Signature Icon */}
          <div className="w-24 h-24 glass border border-pure-gold/40 rounded-full flex items-center justify-center mx-auto mb-10 animate-fade-in shadow-2xl shadow-pure-gold/10">
            <svg className="w-10 h-10 text-pure-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl font-medium font-display tracking-tight leading-tight mb-6">
            Your Experience <br /> <span className="gradient-text">Is Being Published.</span>
          </h1>
          <p className="text-white/50 font-light leading-relaxed italic">
            Your DigitalBloom experience has been commissioned and is being prepared for delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch h-full">
          {/* Acquisition Summary */}
          <div className="glass border border-white/5 p-10 rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-8 font-semibold pr-4">Experience Details</h3>
              {purchase && (
                <div className="space-y-6">
                  <div className="flex justify-between items-baseline group">
                    <span className="text-[10px] uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Manifest ID</span>
                    <span className="text-sm font-light text-white font-mono">{purchase.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-baseline group">
                    <span className="text-[10px] uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Experience Value</span>
                    <span className="text-xl font-light text-pure-gold">${purchase.total_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase tracking-widest text-white/20">Provenance</span>
                    <span className="px-3 py-1 bg-pure-gold/10 text-pure-gold border border-pure-gold/20 rounded-full text-[9px] font-bold uppercase tracking-widest">
                      Verified
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-12 mt-12 border-t border-white/5">
               <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 leading-loose">
                 Digital Bloom™ adheres to a philosophy of scarcity. Your link is an exclusive gateway to luxury motion art.
               </p>
            </div>
          </div>

          {/* Delivery Actions */}
          <div className="glass border border-pure-gold/20 p-10 rounded-[2.5rem] flex flex-col bg-white/[0.02]">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-pure-gold mb-8 font-bold">Secure Delivery</h3>
            
            <div className="flex-grow">
              {purchase?.download_url ? (
                <div className="space-y-8 animate-slide-up">
                  <p className="text-lg font-light text-white/80 leading-relaxed italic pr-4">
                    Your customized DigitalBloom experience is ready for delivery.
                  </p>
                  
                  {new Date(purchase.download_expires_at) > new Date() ? (
                    <div className="space-y-4">
                      <a
                        href={purchase.download_url}
                        download
                        className="w-full btn-primary py-5 rounded-full text-[11px] font-bold tracking-[0.3em] uppercase transition-all shadow-xl shadow-pure-gold/10 flex items-center justify-center space-x-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Access Experience</span>
                      </a>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                         <p className="text-[9px] text-white/40 uppercase tracking-widest italic leading-relaxed text-center">
                           Security Protocol: Link valid for 48 hours. <br /> Maximum 1 download permitted.
                         </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                      <p className="text-xs text-red-500 font-light italic text-center">Exclusive delivery window has closed (48h).</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 opacity-40 group">
                    <div className="w-1 h-1 rounded-full bg-white mt-1.5 group-hover:scale-150 transition-transform"></div>
                    <p className="text-[10px] uppercase tracking-widest text-white leading-loose">Experience confirmation sent to your email.</p>
                  </div>
                  <div className="flex items-start space-x-4 opacity-40 group">
                    <div className="w-1 h-1 rounded-full bg-white mt-1.5 group-hover:scale-150 transition-transform"></div>
                    <p className="text-[10px] uppercase tracking-widest text-white leading-loose">Experience publishing in progress (Est. 2-4 hours).</p>
                  </div>
                  <div className="flex items-start space-x-4 opacity-40 group">
                    <div className="w-1 h-1 rounded-full bg-white mt-1.5 group-hover:scale-150 transition-transform"></div>
                    <p className="text-[10px] uppercase tracking-widest text-white leading-loose">Final provenance certificates being generated.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <Link
                to="/"
                className="w-full btn-secondary py-4 rounded-full text-[10px] uppercase tracking-widest font-semibold text-center"
              >
                Explore More Pieces
              </Link>
              <button
                onClick={() => window.print()}
                className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
              >
                Archive Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Brand Sign-off */}
        <div className="mt-24 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-light">
                Digital Bloom™ <br /> 
                <span className="mt-2 block opacity-50">Digital Multimedia Publishing</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
