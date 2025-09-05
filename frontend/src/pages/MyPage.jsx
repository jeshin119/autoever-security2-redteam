import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiUser, FiEdit, FiShoppingBag, FiHeart, FiMessageCircle, 
  FiSettings, FiLogOut, FiPlus, FiEye, FiMapPin, FiClock, FiX, FiRefreshCw 
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { productService, userService, transactionService, getImageUrl } from '../services/api';

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
  flex-shrink: 0;
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

const UserEmail = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const UserStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CreditSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CreditDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const RefreshButton = styled.button`
  padding: 0.5rem;
  background: white;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
    transform: rotate(180deg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CreditAmount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const ChargeForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AmountInput = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  flex: 1;
  max-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ChargeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const QuickChargeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const QuickChargeButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.primary ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  ` : `
    background: white;
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      border-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.primary};
    }
  `}
`;

const TabsSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: ${props => props.active ? props.theme.colors.backgroundSecondary : 'white'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const TabContent = styled.div`
  padding: 2rem;
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
  background: white;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  opacity: 1;
  
  &.sold {
    background: #f8f9fa;
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

const ProductActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionIcon = styled.button`
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: white;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SoldInfo = styled.div`
  background: #e8f5e8;
  border: 1px solid #d4edda;
  border-radius: 4px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #155724;
`;

const BuyerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const AddProductButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const MyPage = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('selling');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalProducts: 0,
    soldProducts: 0,
    likedProducts: 0
  });
  const [likedProductsCount, setLikedProductsCount] = useState(0);
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeLoading, setChargeLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }
    
    fetchUserData();
  }, [user, history]);

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const fetchUserData = async () => {
    try {
      // Fetch user statistics
      const statsResponse = await userService.getUserStats(user.id);
      const stats = (statsResponse.data && statsResponse.data.data) || userStats;
      setUserStats(stats);
      // 초기 로드시 찜한상품 개수도 설정
      setLikedProductsCount(stats.likedProducts || 0);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const fetchTabData = async () => {
    try {
      setLoading(true);
      
      switch(activeTab) {
        case 'selling':
          const sellingResponse = await productService.getUserProducts(user.id);
          setProducts((sellingResponse.data && sellingResponse.data.data) || []);
          break;
        case 'purchased':
          const purchasedResponse = await transactionService.getUserTransactions({ type: 'purchase' });
          if (purchasedResponse.data && purchasedResponse.data.success) {
            // Map transactions to product format for display
            const purchasedProducts = purchasedResponse.data.data.map(transaction => ({
              ...transaction.Product,
              transactionId: transaction.id,
              purchasedAt: transaction.createdAt,
              purchaseAmount: transaction.amount
            })).filter(product => product.id); // Filter out transactions without products
            setProducts(purchasedProducts);
          } else {
            setProducts([]);
          }
          break;
        case 'liked':
          const likedResponse = await productService.getUserLikedProducts();
          if (likedResponse.data && likedResponse.data.success) {
            const likedProducts = likedResponse.data.data || [];
            setProducts(likedProducts);
            setLikedProductsCount(likedProducts.length);
          } else {
            setProducts([]);
            setLikedProductsCount(0);
          }
          break;
        default:
          setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch tab data:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      await logout();
      history.push('/');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('상품이 삭제되었습니다.');
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getStatusText = (isSold) => {
    return isSold ? '판매완료' : '판매중';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const handleChargeCredits = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(chargeAmount);
    if (!amount || amount <= 0) {
      alert('올바른 충전 금액을 입력해주세요.');
      return;
    }

    setChargeLoading(true);
    try {
      const response = await userService.chargeCredits(user.id, amount);
      if (response.data.success) {
        alert(`${amount}원이 충전되었습니다!`);
        setChargeAmount('');
        // Refresh user data to show updated credits
        fetchUserData();
      } else {
        alert(response.data.message || '충전에 실패했습니다.');
      }
    } catch (error) {
      console.error('Credit charge failed:', error);
      alert('충전에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setChargeLoading(false);
    }
  };

  const handleQuickCharge = (amount) => {
    setChargeAmount(amount.toString());
  };

  const handleRefreshCredits = async () => {
    setRefreshLoading(true);
    try {
      const response = await userService.getUser(user.id);
      if (response.data && response.data.success) {
        // Update user context with new credit information
        const updatedUser = { ...user, credits: response.data.data.credits };
        // Note: This assumes the auth context has a method to update user
        // If not available, we would need to add it to the context
        window.location.reload(); // Fallback to reload if context update is not available
      }
    } catch (error) {
      console.error('Failed to refresh credits:', error);
      alert('크레딧 정보를 새로고침하는데 실패했습니다.');
    } finally {
      setRefreshLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          불러오는 중...
        </div>
      );
    }

    if (products.length === 0) {
      switch(activeTab) {
        case 'selling':
          return (
            <EmptyState>
              <div className="icon">
                <FiShoppingBag />
              </div>
              <h3>등록한 상품이 없습니다</h3>
              <p>첫 번째 상품을 등록해보세요</p>
              <AddProductButton to="/products/new">
                <FiPlus />
                상품 등록하기
              </AddProductButton>
            </EmptyState>
          );
        case 'purchased':
          return (
            <EmptyState>
              <div className="icon">
                <FiShoppingBag />
              </div>
              <h3>구매한 상품이 없습니다</h3>
              <p>관심있는 상품을 찾아보세요</p>
            </EmptyState>
          );
        case 'liked':
          return (
            <EmptyState>
              <div className="icon">
                <FiHeart />
              </div>
              <h3>찜한 상품이 없습니다</h3>
              <p>마음에 드는 상품에 하트를 눌러보세요</p>
            </EmptyState>
          );
        default:
          return null;
      }
    }

    return (
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} as={Link} to={`/products/${product.id}`} className={product.isSold ? 'sold' : ''}>
            <ProductImage image={getImageUrl((product.images && product.images[0]))}>
              <StatusBadge status={product.isSold ? 'sold' : 'available'}>
                {getStatusText(product.isSold)}
              </StatusBadge>
              
              {activeTab === 'selling' && !product.isSold && (
                <ProductActions>
                  <ActionIcon
                    as={Link}
                    to={`/products/${product.id}/edit`}
                    title="수정"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiEdit size={14} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                    title="삭제"
                  >
                    <FiX size={14} />
                  </ActionIcon>
                </ProductActions>
              )}
            </ProductImage>
            
            <ProductInfo>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>
                {activeTab === 'purchased' && product.purchaseAmount 
                  ? `구매가: ${formatPrice(product.purchaseAmount)}`
                  : formatPrice(product.price)
                }
              </ProductPrice>
              <ProductMeta>
                {activeTab === 'purchased' ? (
                  <span>
                    <FiClock size={12} /> 구매일: {formatDate(product.purchasedAt)}
                  </span>
                ) : (
                  <>
                    <span>
                      <FiEye size={12} /> {product.views || 0}
                    </span>
                    <span>
                      <FiClock size={12} /> {formatDate(product.createdAt)}
                    </span>
                  </>
                )}
              </ProductMeta>
              
              {activeTab === 'selling' && product.isSold && product.Buyer && (
                <SoldInfo>
                  <BuyerInfo>
                    <FiUser size={12} />
                    구매자: {product.Buyer.name}
                  </BuyerInfo>
                  <div style={{ marginTop: '0.25rem' }}>
                    <FiClock size={12} />
                    {' '}판매일: {formatDate(product.soldAt)}
                  </div>
                </SoldInfo>
              )}
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    );
  };

  return (
    <Container>
      <ProfileSection>
        <ProfileAvatar>
          {(user.name && user.name.charAt(0)) || (user.email && user.email.charAt(0)) || 'U'}
        </ProfileAvatar>
        
        <ProfileInfo>
          <UserName>{user.name || '익명 사용자'}</UserName>
          <UserEmail>{user.email}</UserEmail>
          
          <UserStats>
            <StatItem>
              <span className="value">{userStats.totalProducts}</span>
              <span className="label">등록상품</span>
            </StatItem>
            <StatItem>
              <span className="value">{userStats.soldProducts}</span>
              <span className="label">판매완료</span>
            </StatItem>
            <StatItem>
              <span className="value">{user.mannerScore || '36.5'}</span>
              <span className="label">매너온도</span>
            </StatItem>
          </UserStats>
          
          <ProfileActions>
            <ActionButton primary>
              <FiEdit />
              프로필 수정
            </ActionButton>
            <ActionButton>
              <FiSettings />
              설정
            </ActionButton>
            <ActionButton onClick={handleLogout}>
              <FiLogOut />
              로그아웃
            </ActionButton>
          </ProfileActions>
        </ProfileInfo>
      </ProfileSection>

      <CreditSection>
        <SectionTitle>크레딧 관리</SectionTitle>
        <CreditDisplay>
          <div>
            <div style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#666' }}>
              보유 크레딧
            </div>
            <CreditAmount>
              {new Intl.NumberFormat('ko-KR').format(user.credits || 0)}원
            </CreditAmount>
          </div>
          <RefreshButton 
            onClick={handleRefreshCredits} 
            disabled={refreshLoading}
            title="크레딧 새로고침"
          >
            <FiRefreshCw size={16} />
          </RefreshButton>
        </CreditDisplay>
        
        <QuickChargeButtons>
          <QuickChargeButton onClick={() => handleQuickCharge(10000)}>
            1만원
          </QuickChargeButton>
          <QuickChargeButton onClick={() => handleQuickCharge(50000)}>
            5만원
          </QuickChargeButton>
          <QuickChargeButton onClick={() => handleQuickCharge(100000)}>
            10만원
          </QuickChargeButton>
        </QuickChargeButtons>
        
        <ChargeForm onSubmit={handleChargeCredits}>
          <AmountInput
            type="number"
            placeholder="충전할 금액 입력"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
            min="1000"
            step="1000"
          />
          <ChargeButton type="submit" disabled={chargeLoading}>
            {chargeLoading ? '충전 중...' : '충전하기'}
          </ChargeButton>
        </ChargeForm>
      </CreditSection>

      <TabsSection>
        <TabsHeader>
          <Tab 
            active={activeTab === 'selling'} 
            onClick={() => setActiveTab('selling')}
          >
            <FiShoppingBag />
            판매중 ({userStats.totalProducts})
          </Tab>
          <Tab 
            active={activeTab === 'purchased'} 
            onClick={() => setActiveTab('purchased')}
          >
            <FiShoppingBag />
            구매내역
          </Tab>
          <Tab 
            active={activeTab === 'liked'} 
            onClick={() => setActiveTab('liked')}
          >
            <FiHeart />
            찜한상품 ({likedProductsCount})
          </Tab>
        </TabsHeader>
        
        <TabContent>
          {renderTabContent()}
        </TabContent>
      </TabsSection>
    </Container>
  );
};

export default MyPage;