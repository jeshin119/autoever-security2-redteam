import React from 'react';

// Simple test component to verify React is working
const TestApp = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>
        🎉 Vintage Market Frontend Test
      </h1>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2>✅ React is working!</h2>
        <p>현재 시간: {new Date().toLocaleString('ko-KR')}</p>
        <p>이 페이지가 보인다면 프론트엔드 서버가 정상적으로 작동하고 있습니다.</p>
        
        <div style={{ marginTop: '20px' }}>
          <h3>🔗 연결 정보:</h3>
          <ul>
            <li>프론트엔드: http://localhost:5173</li>
            <li>백엔드 API: http://localhost:3000</li>
            <li>상태: 정상 작동중</li>
          </ul>
        </div>
        
        <button 
          onClick={() => alert('버튼이 정상적으로 작동합니다!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          테스트 버튼
        </button>
      </div>
    </div>
  );
};

export default TestApp;