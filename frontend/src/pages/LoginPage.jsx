import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.lg};
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: ${props => props.theme.transitions.fast};
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  transition: ${props => props.theme.transitions.fast};
  margin-top: ${props => props.theme.spacing.md};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Links = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.lg};
  
  a {
    color: ${props => props.theme.colors.primary};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  
  const { login } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  const from = (location.state && location.state.from && location.state.from.pathname) || '/';
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Intentionally vulnerable: No input validation
      const result = await login(email, password);
      
      if (result.success) {
        history.replace(from);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <Title>🚪 로그인</Title>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Intentionally vulnerable: No input sanitization
            />
          </FormGroup>
          
          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Intentionally vulnerable: No password requirements
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
        
        <Links>
          <p>
            아직 회원이 아니신가요?{' '}
            <Link to="/register">회원가입</Link>
          </p>
          <p>
            <Link to="/forgot-password">비밀번호 찾기</Link>
          </p>
        </Links>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;