import React, { useState, useEffect } from 'react';

const DevApp = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      setBackendStatus('connected');
      setApiResponse(data);
    } catch (error) {
      console.error('Backend connection failed:', error);
      setBackendStatus('disconnected');
    }
  };

  const testAPI = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`);
      const data = await response.json();
      alert(`API Test Success:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`API Test Failed:\n${error.message}`);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
          🛒 Vintage Market - Development Dashboard
        </h1>
        
        <div style={{ 
          backgroundColor: backendStatus === 'connected' ? '#d4edda' : backendStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
          border: `1px solid ${backendStatus === 'connected' ? '#c3e6cb' : backendStatus === 'disconnected' ? '#f5c6cb' : '#ffeaa7'}`,
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '30px'
        }}>
          <h3>🔗 Backend Connection Status</h3>
          <p><strong>Status:</strong> {
            backendStatus === 'connected' ? '✅ Connected' : 
            backendStatus === 'disconnected' ? '❌ Disconnected' : 
            '🔄 Checking...'
          }</p>
          {backendStatus === 'connected' && apiResponse && (
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Health Response</summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
                marginTop: '5px'
              }}>
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </details>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={{ 
            border: '1px solid #dee2e6', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🌐 Server URLs</h3>
            <div style={{ lineHeight: '1.8' }}>
              <div><strong>Frontend:</strong> <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></div>
              <div><strong>Backend API:</strong> <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></div>
              <div><strong>Health Check:</strong> <a href="http://localhost:3000/api/health" target="_blank">http://localhost:3000/api/health</a></div>
            </div>
          </div>

          <div style={{ 
            border: '1px solid #dee2e6', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#f8f9fa'
          }}>
            <h3>🧪 API Test</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                onClick={() => testAPI('health')}
                style={{
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test Health API
              </button>
              <button 
                onClick={() => testAPI('users')}
                style={{
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test Users API
              </button>
              <button 
                onClick={() => testAPI('products')}
                style={{
                  padding: '10px',
                  backgroundColor: '#fd7e14',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test Products API
              </button>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e9ecef',
          borderRadius: '8px'
        }}>
          <h3>📋 Development Information</h3>
          <div style={{ lineHeight: '1.6' }}>
            <p><strong>Current Time:</strong> {new Date().toLocaleString('ko-KR')}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 80)}...</p>
            <p><strong>Window Location:</strong> {window.location.href}</p>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px',
          textAlign: 'center',
          color: '#666'
        }}>
          <p>이 개발 대시보드는 프론트엔드와 백엔드 연결을 테스트하기 위한 페이지입니다.</p>
          <p>실제 애플리케이션을 보려면 main.jsx에서 App 컴포넌트로 변경하세요.</p>
        </div>
      </div>
    </div>
  );
};

export default DevApp;