import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const DemoHtmlPage = () => {
  const params = useParams();
  const fileName = params.fileName || 'auth_flow.html';
  const iframeRef = useRef(null);

  useEffect(() => {
    // For Create React App, HTML files need to be in the public directory
    // to be accessible via URL. This component expects the HTML file to be
    // in the public/html-ux-models directory.
    const htmlPath = `/html-ux-models/${fileName}`;
    
    if (iframeRef.current) {
      iframeRef.current.src = htmlPath;
    }
  }, [fileName]);

  return (
    <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        title={`Demo HTML Page - ${fileName}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

export default DemoHtmlPage;

