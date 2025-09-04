import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 200px;
  }
`;

const BannerSlide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    ${props => props.gradient[0]} 0%, 
    ${props => props.gradient[1]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.active ? 1 : 0};
  transition: opacity 1s ease-in-out;
  cursor: pointer;
`;

const BannerContent = styled.div`
  text-align: center;
  color: white;
  padding: ${props => props.theme.spacing.xl};
`;

const BannerTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const BannerSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.95;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const BannerButton = styled(Link)`
  display: inline-block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  background: white;
  color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 600;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: ${props => props.theme.spacing.md};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Indicator = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
`;

const banners = [
  {
    id: 1,
    title: '🎉 신규 회원 특별 혜택',
    subtitle: '지금 가입하고 5,000 포인트 받으세요!',
    link: '/register',
    buttonText: '회원가입',
    gradient: ['#FF6B6B', '#4ECDC4'],
  },
  {
    id: 2,
    title: '📱 모바일앱 출시',
    subtitle: '언제 어디서나 편리한 중고거래',
    link: '/download',
    buttonText: '앱 다운로드',
    gradient: ['#667EEA', '#764BA2'],
  },
  {
    id: 3,
    title: '🛡️ 안전거래 시스템',
    subtitle: '믿고 거래하는 안전한 중고거래',
    link: '/safety',
    buttonText: '자세히 보기',
    gradient: ['#F093FB', '#F5576C'],
  },
  {
    id: 4,
    title: '🚚 무료 배송 이벤트',
    subtitle: '이번 달 한정! 전 상품 무료배송',
    link: '/event',
    buttonText: '이벤트 참여',
    gradient: ['#FA709A', '#FEE140'],
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BannerContainer>
      {banners.map((banner, index) => (
        <BannerSlide
          key={banner.id}
          active={index === activeIndex}
          gradient={banner.gradient}
        >
          <BannerContent>
            <BannerTitle>{banner.title}</BannerTitle>
            <BannerSubtitle>{banner.subtitle}</BannerSubtitle>
            <BannerButton to={banner.link}>
              {banner.buttonText}
            </BannerButton>
          </BannerContent>
        </BannerSlide>
      ))}
      
      <Indicators>
        {banners.map((_, index) => (
          <Indicator
            key={index}
            active={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </Indicators>
    </BannerContainer>
  );
};

export default Banner;