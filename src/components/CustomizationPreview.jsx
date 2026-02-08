export default function CustomizationPreview({ product, customization, colorThemes }) {
  const selectedTheme = colorThemes.find(t => t.id === customization.colorTheme);

  return (
    <div className="preview-container">
      <h3 className="preview-title">Live Preview</h3>
      
      <div className="preview-frame">
        {/* Video Preview */}
        <div className="preview-video-wrapper">
          <video
            src={product.video_url}
            autoPlay
            loop
            muted
            playsInline
            className="preview-video"
            style={{
              filter: customization.colorTheme !== 'original' 
                ? `hue-rotate(${getHueRotation(customization.colorTheme)}deg) saturate(1.2)` 
                : 'none'
            }}
          />
          
          {/* Color Overlay */}
          {selectedTheme && customization.colorTheme !== 'original' && (
            <div 
              className="preview-overlay"
              style={{
                background: `linear-gradient(135deg, ${selectedTheme.colors[0]}22, ${selectedTheme.colors[1]}22)`
              }}
            />
          )}

          {/* Custom Message Overlay */}
          {customization.customMessageShort && (
            <div className="preview-message">
              <h2 className="preview-message-text">
                {customization.customMessageShort}
              </h2>
            </div>
          )}
        </div>

        {/* Customization Summary */}
        <div className="preview-summary">
          {customization.occasion && (
            <div className="preview-detail">
              <span className="preview-label">Occasion:</span>
              <span className="preview-value">{customization.occasion}</span>
            </div>
          )}
          {customization.colorTheme && (
            <div className="preview-detail">
              <span className="preview-label">Theme:</span>
              <span className="preview-value">{selectedTheme?.name}</span>
            </div>
          )}
          {customization.isGift && customization.recipientName && (
            <div className="preview-detail">
              <span className="preview-label">Gift for:</span>
              <span className="preview-value">{customization.recipientName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to map theme to hue rotation
function getHueRotation(theme) {
  const rotations = {
    warm: 15,
    cool: 180,
    elegant: 45,
    romantic: -10,
    original: 0
  };
  return rotations[theme] || 0;
}
