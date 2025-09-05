import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiCheckCircle, 
  FiShoppingBag, 
  FiUser, 
  FiMapPin, 
  FiClock,
  FiCreditCard,
  FiArrowRight,
  FiHome,
  FiTruck,
  FiTag,
  FiPhone
} from 'react-icons/fi';
import { productService, transactionService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #28a745, #20c997);
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2.5rem;
  animation: scaleIn 0.6s ease-out;
  
  @keyframes scaleIn {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 2rem;
`;

const ProductSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: left;
`;

const ProductHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: ${props => props.image ? `url(${props.image})` : '#e2e8f0'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #e53e3e;
  margin-bottom: 0.5rem;
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
`;

const TransactionDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled(Link)`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: #f8f9fa;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #e2e8f0;
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #667eea;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fed7d7;
  border: 1px solid #fc8181;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const DeliverySection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: #718096;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #2d3748;
  font-weight: 600;
`;

const PaymentSummary = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const DiscountText = styled.span`
  color: #dc3545;
  font-weight: 600;
`;

const PurchaseSuccessPage = function() {
  var searchParams = useSearchParams()[0];
  var navigate = useNavigate();
  var user = useAuth().user;
  var productId = searchParams.get('productId');
  var transactionId = searchParams.get('transactionId');
  
  var _useState = useState(null);
  var product = _useState[0];
  var setProduct = _useState[1];
  
  var _useState2 = useState(null);
  var transaction = _useState2[0];
  var setTransaction = _useState2[1];
  
  var _useState3 = useState(true);
  var loading = _useState3[0];
  var setLoading = _useState3[1];
  
  var _useState4 = useState('');
  var error = _useState4[0];
  var setError = _useState4[1];

  useEffect(function() {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!productId && !transactionId) {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [user, productId, transactionId, navigate]);

  var fetchData = function() {
    var fetchPromises = [];
    
    if (productId) {
      fetchPromises.push(
        productService.getProduct(productId)
          .then(function(response) {
            var productData = (response.data && response.data.data) || response.data;
            setProduct(productData);
          })
          .catch(function(err) {
            console.error('Failed to fetch product:', err);
            throw err;
          })
      );
    }
    
    if (transactionId) {
      fetchPromises.push(
        transactionService.getTransaction(transactionId)
          .then(function(response) {
            var transactionData = (response.data && response.data.data) || response.data;
            setTransaction(transactionData);
            if (!productId && transactionData.Product) {
              setProduct(transactionData.Product);
            }
          })
          .catch(function(err) {
            console.error('Failed to fetch transaction:', err);
            throw err;
          })
      );
    }
    
    Promise.all(fetchPromises)
      .then(function() {
        setLoading(false);
      })
      .catch(function(err) {
        setError('구매 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      });
  };

  var formatPrice = function(price) {
    if (!price || isNaN(price)) {
      return '0원';
    }
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  var formatDate = function(dateString) {
    if (!dateString) return '정보 없음';
    
    try {
      var date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '정보 없음';
      }
      return date.toLocaleString('ko-KR');
    } catch (err) {
      return '정보 없음';
    }
  };

  if (loading) {
    return (
      <Container>
        <SuccessCard>
          <LoadingSpinner />
          <p>구매 정보를 불러오는 중...</p>
        </SuccessCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SuccessCard>
          <ErrorMessage>{error}</ErrorMessage>
          <Button to="/">홈으로 돌아가기</Button>
        </SuccessCard>
      </Container>
    );
  }

  return (
    <Container>
      <SuccessCard>
        <SuccessIcon>
          <FiCheckCircle />
        </SuccessIcon>
        
        <Title>구매가 완료되었습니다!</Title>
        <Subtitle>
          성공적으로 상품을 구매했습니다. 판매자가 곧 연락드릴 예정입니다.
        </Subtitle>

        {product && (
          <ProductSection>
            <ProductHeader>
              <ProductImage image={getImageUrl(product.images && product.images[0])} />
              <ProductInfo>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                <SellerInfo>
                  <FiUser size={14} />
                  {product.sellerName || '판매자'}
                  {product.location && (
                    <>
                      <FiMapPin size={14} style={{ marginLeft: '0.5rem' }} />
                      {product.location}
                    </>
                  )}
                </SellerInfo>
              </ProductInfo>
            </ProductHeader>

            <TransactionDetails>
              <DetailItem>
                <DetailLabel>구매 일시</DetailLabel>
                <DetailValue>
                  <FiClock size={16} />
                  {formatDate(transaction ? transaction.createdAt : new Date())}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>결제 방법</DetailLabel>
                <DetailValue>
                  <FiCreditCard size={16} />
                  크레딧 결제
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>거래 번호</DetailLabel>
                <DetailValue>
                  #{transactionId || 'N/A'}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>구매자</DetailLabel>
                <DetailValue>
                  <FiUser size={16} />
                  {user ? user.name : '구매자'}
                </DetailValue>
              </DetailItem>
            </TransactionDetails>
          </ProductSection>
        )}

        {/* 배송지 정보 */}
        {transaction && transaction.deliveryInfo && (
          <DeliverySection>
            <SectionTitle>
              <FiTruck />
              배송지 정보
            </SectionTitle>
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>받는 분</InfoLabel>
                <InfoValue>
                  {JSON.parse(transaction.deliveryInfo).recipientName || '정보 없음'}
                </InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>연락처</InfoLabel>
                <InfoValue>
                  <FiPhone size={14} style={{ marginRight: '0.25rem' }} />
                  {JSON.parse(transaction.deliveryInfo).phone || '정보 없음'}
                </InfoValue>
              </InfoItem>
              
              <InfoItem style={{ gridColumn: '1 / -1' }}>
                <InfoLabel>배송 주소</InfoLabel>
                <InfoValue>
                  {(() => {
                    try {
                      const delivery = JSON.parse(transaction.deliveryInfo);
                      const address = `${delivery.zipCode ? `(${delivery.zipCode}) ` : ''}${delivery.address || ''}${delivery.detailAddress ? ` ${delivery.detailAddress}` : ''}`;
                      return address || '정보 없음';
                    } catch (e) {
                      return '정보 없음';
                    }
                  })()}
                </InfoValue>
              </InfoItem>
              
              <InfoItem>
                <InfoLabel>배송 방법</InfoLabel>
                <InfoValue>
                  {transaction.deliveryType === 'express' ? '빠른배송 (1-2일)' : '일반배송 (2-3일)'}
                </InfoValue>
              </InfoItem>
              
              {(() => {
                try {
                  const delivery = JSON.parse(transaction.deliveryInfo);
                  return delivery.deliveryRequest ? (
                    <InfoItem>
                      <InfoLabel>배송 요청사항</InfoLabel>
                      <InfoValue>{delivery.deliveryRequest}</InfoValue>
                    </InfoItem>
                  ) : null;
                } catch (e) {
                  return null;
                }
              })()}
            </InfoGrid>
          </DeliverySection>
        )}

        {/* 결제 정보 */}
        {transaction && (
          <PaymentSummary>
            <SectionTitle>
              <FiCreditCard />
              결제 내역
            </SectionTitle>
            
            <PaymentRow>
              <span>상품 금액</span>
              <span>{formatPrice(transaction.productPrice || product?.price)}</span>
            </PaymentRow>
            
            <PaymentRow>
              <span>배송비</span>
              <span>{formatPrice(transaction.deliveryFee || 3000)}</span>
            </PaymentRow>
            
            {transaction.discount > 0 && (
              <PaymentRow>
                <span>
                  할인
                  {transaction.appliedCoupon && (
                    <>
                      <FiTag size={14} style={{ marginLeft: '0.25rem' }} />
                      ({JSON.parse(transaction.appliedCoupon).name})
                    </>
                  )}
                </span>
                <DiscountText>-{formatPrice(transaction.discount)}</DiscountText>
              </PaymentRow>
            )}
            
            <PaymentRow>
              <span>총 결제금액</span>
              <span>{formatPrice(transaction.amount)}</span>
            </PaymentRow>
          </PaymentSummary>
        )}

        <ActionButtons>
          <Button to="/my">
            <FiShoppingBag />
            구매내역 보기
          </Button>
          <Button to="/products" primary>
            <FiArrowRight />
            쇼핑 계속하기
          </Button>
          <Button to="/">
            <FiHome />
            홈으로
          </Button>
        </ActionButtons>
      </SuccessCard>
    </Container>
  );
};

export default PurchaseSuccessPage;