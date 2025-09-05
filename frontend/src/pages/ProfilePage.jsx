import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiStar, FiMapPin, FiClock, FiShield } from 'react-icons/fi';
import { userService, productService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProfileSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const UserMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textSecondary};

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MannerScore = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  font-weight: 600;
`;

const ProductsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isSold ? '#f8f9fa' : 'white'};
  opacity: ${props => props.isSold ? 0.8 : 1};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch(props.status) {
      case 'sold': return '#dc3545';
      case 'reserved': return '#fd7e14';
      default: return '#28a745';
    }
  }};
  color: white;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ProfilePage = () => {
  const { userId } = useParams();
  const history = useHistory();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if viewing own profile
  const isOwnProfile = currentUser && userId && parseInt(userId) === parseInt(currentUser.id);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch user data
      const userResponse = await userService.getUser(userId);
      if (userResponse.data && userResponse.data.success) {
        setUser(userResponse.data.data);
      }
      
      // Fetch user's products using the products endpoint with userId filter
      const productsResponse = await productService.getProducts({ 
        userId: userId,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      
      if (productsResponse.data && productsResponse.data.success) {
        setProducts(productsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) {
      return '가격 미정';
    }
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getStatusText = (isSold) => {
    return isSold ? '판매완료' : '판매중';
  };

  const formatJoinDate = (date) => {
    if (!date) return '가입일 미상';
    
    try {
      const joinDate = new Date(date);
      if (isNaN(joinDate.getTime())) {
        return '가입일 미상';
      }
      return joinDate.toLocaleDateString('ko-KR');
    } catch (error) {
      console.error('Error formatting join date:', error);
      return '가입일 미상';
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          프로필을 불러오는 중...
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          사용자를 찾을 수 없습니다.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileSection>
        <ProfileAvatar>
          {(user.name && user.name.charAt(0)) || 'U'}
        </ProfileAvatar>
        
        <ProfileInfo>
          <UserName>{user.name || '익명 사용자'}</UserName>
          <UserMeta>
            <MetaItem>
              <FiMapPin size={14} />
              {user.address || '위치 정보 없음'}
            </MetaItem>
            <MetaItem>
              <FiClock size={14} />
              {formatJoinDate(user.createdAt)} 가입
            </MetaItem>
          </UserMeta>
          <MannerScore>
            <FiShield />
            매너온도 {user.mannerScore || '36.5'}점
          </MannerScore>
        </ProfileInfo>
      </ProfileSection>

      <ProductsSection>
        <SectionTitle>판매 상품 ({products.length})</SectionTitle>
        
        {products.length === 0 ? (
          <EmptyState>
            <p>등록된 상품이 없습니다</p>
          </EmptyState>
        ) : (
          <ProductGrid>
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                onClick={() => history.push(`/products/${product.id}`)}
                isSold={product.isSold}
              >
                <ProductImage image={getImageUrl((product.images && product.images[0]))}>
                  <StatusBadge status={product.isSold ? 'sold' : 'available'}>
                    {getStatusText(product.isSold)}
                  </StatusBadge>
                </ProductImage>
                <ProductInfo>
                  <ProductTitle>{product.title}</ProductTitle>
                  <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        )}
      </ProductsSection>
    </Container>
  );
};

export default ProfilePage;
