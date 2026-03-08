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
          {customization.shortMessage && (
            <div className="preview-message">
              <h2 className="preview-message-text">
                {customization.shortMessage}
              </h2>
            </div>
          )}
        </div>

        {/* Customization Summary */}
        <div className="preview-summary">
          {customization.occasion && (
            <div className="preview-detail">
              <span className="preview-label">Occasion:</span>
              <span className="preview-value">
                {customization.occasion.charAt(0).toUpperCase() + customization.occasion.slice(1)}
              </span>
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
          {customization.balloonMessage && customization.balloonMessage !== 'none' && (
            <div className="preview-detail">
              <span className="preview-label">Balloon:</span>
              <span className="preview-value">
                {customization.balloonMessage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          )}
          {customization.sloganType === 'custom'
            ? customization.customSlogan && (
                <div className="preview-detail">
                  <span className="preview-label">Slogan:</span>
                  <span className="preview-value">{customization.customSlogan}</span>
                </div>
              )
            : customization.sloganType !== 'none' && customization.sloganType && (
                <div className="preview-detail">
                  <span className="preview-label">Slogan:</span>
                  <span className="preview-value">{customization.sloganType}</span>
                </div>
              )}
          {customization.to && (
            <div className="preview-detail">
              <span className="preview-label">To:</span>
              <span className="preview-value">{customization.to}</span>
            </div>
          )}
          {customization.from && (
            <div className="preview-detail">
              <span className="preview-label">From:</span>
              <span className="preview-value">{customization.from}</span>
            </div>
          )}
          {customization.symbol && (
            <div className="preview-detail">
              <span className="preview-label">Symbol:</span>
              <span className="preview-value">
                {customization.symbol.charAt(0).toUpperCase() + customization.symbol.slice(1)}
              </span>
            </div>
          )}
          {customization.deliveryMethod && (
            <div className="preview-detail">
              <span className="preview-label">Delivery:</span>
              <span className="preview-value">
                {customization.deliveryMethod.charAt(0).toUpperCase() + customization.deliveryMethod.slice(1)}
              </span>
            </div>
          )}
          {customization.deliveryTiming && (
            <div className="preview-detail">
              <span className="preview-label">Timing:</span>
              <span className="preview-value">
                {customization.deliveryTiming === 'send-to-self-first'
                  ? 'Send to me first'
                  : customization.deliveryTiming.charAt(0).toUpperCase() + customization.deliveryTiming.slice(1)}
              </span>
            </div>
          )}
          {customization.deliveryMethod === 'text' && customization.deliveryPhone && (
            <div className="preview-detail">
              <span className="preview-label">Phone:</span>
              <span className="preview-value">{customization.deliveryPhone}</span>
            </div>
          )}
          {customization.deliveryMethod === 'email' && customization.deliveryEmail && (
            <div className="preview-detail">
              <span className="preview-label">Email:</span>
              <span className="preview-value">{customization.deliveryEmail}</span>
            </div>
          )}
          {customization.deliveryTiming === 'later' && customization.scheduledDate && (
            <div className="preview-detail">
              <span className="preview-label">Date:</span>
              <span className="preview-value">{customization.scheduledDate}</span>
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
