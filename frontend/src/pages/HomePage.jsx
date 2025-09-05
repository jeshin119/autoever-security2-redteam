import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProductCard from '../components/product/ProductCard';
import CategoryGrid from '../components/home/CategoryGrid';
import Banner from '../components/home/Banner';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getPopularProducts, getRecentProducts } from '../services/productService';

const HomeContainer = styled.div`
  min-height: calc(100vh - 60px);
`;

const Section = styled.section`
  padding: ${props => props.theme.spacing.xl} 0;
  
  &:nth-child(even) {
    background: ${props => props.theme.colors.backgroundPaper};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ViewMoreLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
  
  /* Desktop: 한 줄에 8개 */
  grid-template-columns: repeat(8, 1fr);
  
  /* Large screens: 한 줄에 6개 */
  @media (max-width: 1400px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  /* Medium screens: 한 줄에 4개 */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* Small screens: 한 줄에 3개 */
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${props => props.theme.spacing.sm};
  }
  
  /* Mobile: 한 줄에 2개 */
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${props => props.theme.spacing.xs};
  }
  
  /* Extra small: 한 줄에 1개 */
  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
  
  /* ProductCard 크기 조정 */
  > * {
    min-width: 0; /* Grid 아이템이 부모 컨테이너를 넘지 않도록 */
  }
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.primaryDark} 100%);
  color: white;
  padding: ${props => props.theme.spacing.xxl} 0;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const HeroButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Link)`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.primary ? 'white' : 'transparent'};
  color: ${props => props.primary ? props.theme.colors.primary : 'white'};
  border: 2px solid white;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 600;
  font-size: 1.1rem;
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  padding: ${props => props.theme.spacing.xl} 0;
  text-align: center;
`;

const StatItem = styled.div`
  h3 {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: ${props => props.theme.spacing.sm};
  }
  
  p {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 1.1rem;
  }
`;


const HomePage = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Intentionally vulnerable: No proper error handling
      const popular = await getPopularProducts(8);
      const recent = await getRecentProducts(8);
      
      setPopularProducts(popular.data || []);
      setRecentProducts(recent.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <HeroTitle>당신의 빈티지를 거래하세요</HeroTitle>
          <HeroSubtitle>
            동네 이웃들과 함께하는 따뜻한 중고거래 플랫폼
          </HeroSubtitle>
          <HeroButtons>
            <HeroButton to="/products/new" primary="true">
              판매하기
            </HeroButton>
            <HeroButton to="/products">
              구경하기
            </HeroButton>
          </HeroButtons>
        </Container>
      </HeroSection>

      {/* Banner Section */}
      <Section>
        <Container>
          <Banner />
        </Container>
      </Section>

      {/* Categories Section */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>카테고리별 상품</SectionTitle>
            <ViewMoreLink to="/products">
              전체보기 →
            </ViewMoreLink>
          </SectionHeader>
          <CategoryGrid />
        </Container>
      </Section>

      {/* Popular Products */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>🔥 인기 상품</SectionTitle>
            <ViewMoreLink to="/products?sort=popular">
              더보기 →
            </ViewMoreLink>
          </SectionHeader>
          <ProductGrid>
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </Container>
      </Section>

      {/* Recent Products */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>✨ 최근 등록 상품</SectionTitle>
            <ViewMoreLink to="/products?sort=recent">
              더보기 →
            </ViewMoreLink>
          </SectionHeader>
          <ProductGrid>
            {recentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        </Container>
      </Section>


      {/* Stats Section */}
      <Section>
        <Container>
          <SectionHeader>
            <SectionTitle>믿을 수 있는 중고거래</SectionTitle>
          </SectionHeader>
          <StatsSection>
            <StatItem>
              <h3>1,234,567</h3>
              <p>누적 회원수</p>
            </StatItem>
            <StatItem>
              <h3>987,654</h3>
              <p>누적 거래량</p>
            </StatItem>
            <StatItem>
              <h3>4.8/5.0</h3>
              <p>평균 만족도</p>
            </StatItem>
            <StatItem>
              <h3>24/7</h3>
              <p>고객 지원</p>
            </StatItem>
          </StatsSection>
        </Container>
      </Section>
    </HomeContainer>
  );
};

export default HomePage;