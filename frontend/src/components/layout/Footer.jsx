import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme.colors.backgroundDark};
  padding: ${props => props.theme.spacing.xl} 0;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const FooterSection = styled.div`
  h4 {
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
    font-size: 1.1rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  
  a {
    color: ${props => props.theme.colors.textSecondary};
    transition: ${props => props.theme.transitions.fast};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.full};
  color: ${props => props.theme.colors.text};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h4>Vintage Market</h4>
          <FooterLinks>
            <Link to="/about">회사소개</Link>
            <Link to="/press">언론보도</Link>
            <Link to="/careers">채용</Link>
            <Link to="/contact">문의하기</Link>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h4>이용안내</h4>
          <FooterLinks>
            <Link to="/guide">이용가이드</Link>
            <Link to="/safety">안전거래 가이드</Link>
            <Link to="/payment">결제 안내</Link>
            <Link to="/shipping">배송 안내</Link>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h4>고객지원</h4>
          <FooterLinks>
            <Link to="/help">도움말</Link>
            <Link to="/faq">자주 묻는 질문</Link>
            <Link to="/support">고객센터</Link>
            <Link to="/report">신고하기</Link>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h4>정책</h4>
          <FooterLinks>
            <Link to="/terms">이용약관</Link>
            <Link to="/privacy">개인정보처리방침</Link>
            <Link to="/location">위치기반서비스 이용약관</Link>
            <Link to="/youth">청소년보호정책</Link>
          </FooterLinks>
          
          <SocialLinks>
            <SocialIcon href="#" target="_blank">📘</SocialIcon>
            <SocialIcon href="#" target="_blank">📷</SocialIcon>
            <SocialIcon href="#" target="_blank">🐦</SocialIcon>
            <SocialIcon href="#" target="_blank">📺</SocialIcon>
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>© 2025 Vintage Market. All rights reserved.</p>
        <p>⚠️ 이 사이트는 교육용 보안 실습 플랫폼입니다. 실제 거래를 하지 마세요.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;