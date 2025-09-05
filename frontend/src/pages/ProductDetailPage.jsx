import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiArrowLeft, FiHeart, FiShare2, FiShoppingCart,
  FiMapPin, FiEye, FiClock, FiUser, FiTag, FiShield
} from 'react-icons/fi';
import { productService, getImageUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PurchaseModal from '../components/purchase/PurchaseModal';
import CreditInsufficientModal from '../components/common/CreditInsufficientModal';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ProductSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div``;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  margin-bottom: 1rem;
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  flex-shrink: 0;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'sold': return '#dc3545';
      case 'reserved': return '#fd7e14';
      default: return '#28a745';
    }
  }};
  color: white;
`;

const InfoSection = styled.div``;

const ProductHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProductTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }

  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 1rem;
  background: white;
  color: ${props => props.theme.colors.text};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
`;

const SellerSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const SellerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SellerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const SellerInfo = styled.div`
  flex: 1;
`;

const SellerName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const SellerRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DescriptionSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.div`
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
`;

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DetailItem = styled.div`
  padding: 1rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.error};
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseModal = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
`;

const RelatedSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const RelatedProductCard = styled(Link)`
  display: block;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const RelatedProductImage = styled.div`
  width: 100%;
  height: 150px;
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.border};
  background-size: cover;
  background-position: center;
`;

const RelatedProductInfo = styled.div`
  padding: 1rem;
`;

const RelatedProductTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RelatedProductPrice = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const LikeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

// 문자열(JSON) 또는 배열을 안전하게 배열로 변환
const toImagesArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Check if user has liked this product
  useEffect(() => {
    if (product && user) {
      checkLikeStatus();
    }
  }, [product, user]);

  // Fetch related products when product is loaded
  useEffect(() => {
    if (product && product.category) {
      fetchRelatedProducts();
    }
  }, [product && product.category]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const resp = await productService.getProduct(id);
      // 백엔드가 {success, data} 래핑이거나 바로 객체일 수 있어 호환 처리
      const raw = (resp && resp.data && resp.data.data) || (resp && resp.data) || {};

      // images는 문자열(JSON)로 올 수 있으니 배열로 정규화
      const images = toImagesArray(raw.images);

      // 필드 명 혼재 보정
      const condition =
        (raw.condition !== undefined && raw.condition !== null) ? raw.condition : 
        (raw.conditionStatus !== undefined && raw.conditionStatus !== null) ? raw.conditionStatus : 
        (raw.condition_status !== undefined && raw.condition_status !== null) ? raw.condition_status : 'good';

      const negotiable =
        raw.negotiable === true ||
        raw.negotiable === 'true' ||
        raw.negotiable === 1 ||
        raw.negotiable === '1';

      const userId = (raw.userId !== undefined && raw.userId !== null) ? raw.userId : 
                    (raw.sellerId !== undefined && raw.sellerId !== null) ? raw.sellerId : 
                    (raw.seller_id !== undefined && raw.seller_id !== null) ? raw.seller_id : null;

      // isSold 값을 그대로 사용
      const isSold = raw.isSold || raw.is_sold || false;

      const product = {
        ...raw,
        images,
        condition,
        negotiable,
        userId,
        isSold,
        // 판매자 보조 정보
        sellerName: (raw.seller && raw.seller.name) || raw.sellerName || '익명 사용자',
        sellerRating:
          (raw.seller && raw.seller.mannerScore) || raw.sellerRating || 36.5,
        sellerPhone: raw.sellerPhone || (raw.seller && raw.seller.phone),
        sellerEmail: raw.sellerEmail || (raw.seller && raw.seller.email),
      };

      setProduct(product);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      if (error.response && error.response.status === 404) {
        setError('존재하지 않는 상품입니다.');
      } else {
        setError('상품을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await productService.getProducts({
        category: product.category,
        limit: 4,
        is_sold: false
      });

      if (response.data && response.data.success) {
        // Filter out current product and limit to 4 items
        const related = response.data.data
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const checkLikeStatus = async () => {
    if (!user) return;
    try {
      const response = await productService.checkLikeStatus(id);
      if (response.data && response.data.success) {
        setIsLiked(!!(response.data.data && response.data.data.isLiked));
      }
    } catch (error) {
      // Silent fail; like status is non-critical
      console.warn('Failed to check like status:', error);
    }
  };

  const handlePurchaseClick = () => {
    if (!user) {
      history.push('/login');
      return;
    }
    
    if (user.id === product.userId) {
      alert('자신의 상품은 구매할 수 없습니다.');
      return;
    }

    if (product.isSold) {
      alert('이미 판매된 상품입니다.');
      return;
    }

    setShowPurchaseModal(true);
  };

  const handlePurchaseConfirm = async () => {
    setPurchaseLoading(true);
    try {
      const response = await productService.purchaseProduct(id);
      
      // Check for successful response (either success=true or status 200)
      if (response.data && (response.data.success === true || response.status === 200)) {
        setShowPurchaseModal(false);
        
        // Navigate to success page with product and transaction info
        const transactionData = response.data.data;
        const searchParams = new URLSearchParams();
        searchParams.set('productId', id);
        if (transactionData && transactionData.transactionId) {
          searchParams.set('transactionId', transactionData.transactionId);
        }
        
        navigate(`/purchase/success?${searchParams.toString()}`);
      } else {
        // Handle failed purchase response
        const message = (response.data && response.data.message) || '구매에 실패했습니다.';
        alert(message);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('크레딧이 부족합니다')) {
          setShowPurchaseModal(false);
          setShowCreditModal(true);
        } else {
          alert(errorMessage);
        }
      } else {
        alert('구매에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleCreditModalClose = () => {
    setShowCreditModal(false);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);

      if (newLikedState) {
        await productService.likeProduct(id);
        // Update product likes count locally
        setProduct(prev => ({
          ...prev,
          likes: (prev.likes || 0) + 1
        }));
      } else {
        await productService.unlikeProduct(id);
        // Update product likes count locally
        setProduct(prev => ({
          ...prev,
          likes: Math.max((prev.likes || 0) - 1, 0)
        }));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert the like state if API call fails
      setIsLiked(!isLiked);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
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

  const getConditionText = (condition) => {
    switch (condition) {
      case 'like_new': return '거의 새것';
      case 'good': return '좋음';
      case 'fair': return '보통';
      case 'poor': return '나쁨';
      default: return condition;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '등록일 미상';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '등록일 미상';
      }

      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return '오늘';
      if (diffDays === 2) return '어제';
      if (diffDays <= 7) return `${diffDays}일 전`;
      return date.toLocaleDateString('ko-KR');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '등록일 미상';
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>상품을 불러오는 중...</LoadingSpinner>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <ErrorMessage>{error || '상품을 찾을 수 없습니다.'}</ErrorMessage>
      </Container>
    );
  }

  const images = Array.isArray(product && product.images) ? product.images : toImagesArray(product && product.images);
  const currentImage = images[currentImageIndex] ? getImageUrl(images[currentImageIndex]) : '';

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft />
        돌아가기
      </BackButton>

      <ProductSection>
        <ImageSection>
          <MainImage
            image={currentImage}
            onClick={() => setShowImageModal(true)}
          >
            <StatusBadge status={product.isSold ? 'sold' : 'available'}>
              {getStatusText(product.isSold)}
            </StatusBadge>
          </MainImage>

          {images.length > 1 && (
            <ImageThumbnails>
              {images.map((img, index) => (
                <Thumbnail
                  key={index}
                  image={getImageUrl(img)}
                  active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </ImageThumbnails>
          )}
        </ImageSection>

        <InfoSection>
          <ProductHeader>
            <ProductTitle>{product.title}</ProductTitle>
            <ProductPrice>{formatPrice(product.price)}</ProductPrice>
            <ProductMeta>
              <MetaItem>
                <FiMapPin size={14} />
                {product.location}
              </MetaItem>
              <MetaItem>
                <FiClock size={14} />
                {formatDate(product.createdAt)}
              </MetaItem>
              <MetaItem>
                <FiEye size={14} />
                조회 {product.views || 0}
              </MetaItem>
              <MetaItem>
                <FiHeart size={14} />
                찜 {product.likes || 0}
              </MetaItem>
              <MetaItem>
                <FiTag size={14} />
                {product.category}
              </MetaItem>
            </ProductMeta>
          </ProductHeader>

          <ActionButtons>
            <PrimaryButton
              onClick={handlePurchaseClick}
              disabled={product.isSold || (user && user.id === product.userId)}
            >
              <FiShoppingCart />
              {product.isSold ? '판매완료' : '구매하기'}
            </PrimaryButton>
            <SecondaryButton onClick={handleLikeToggle}>
              <FiHeart color={isLiked ? '#ff4757' : 'currentColor'} />
            </SecondaryButton>
            <SecondaryButton onClick={handleShare}>
              <FiShare2 />
            </SecondaryButton>
          </ActionButtons>

          <SellerSection>
            <SellerHeader>
              <SellerAvatar>
                {(product.sellerName && product.sellerName.charAt(0)) || 'U'}
              </SellerAvatar>
              <SellerInfo>
                <SellerName>{product.sellerName || '익명 사용자'}</SellerName>
                <SellerRating>
                  <FiShield size={14} />
                  매너점수 {product.sellerRating || '36.5'}점
                </SellerRating>
              </SellerInfo>
            </SellerHeader>

            {/* Additional seller info */}
            <ProductDetails style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              {product.sellerPhone && (
                <DetailItem>
                  <DetailLabel>연락처</DetailLabel>
                  <DetailValue>{product.sellerPhone}</DetailValue>
                </DetailItem>
              )}
              <DetailItem>
                <DetailLabel>위치</DetailLabel>
                <DetailValue>{product.location}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>상품 상태</DetailLabel>
                <DetailValue>{getConditionText(product.condition)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>가격 협상</DetailLabel>
                <DetailValue>{product.negotiable ? '가능' : '불가능'}</DetailValue>
              </DetailItem>
            </ProductDetails>

            <Link
              to={`/users/${product.userId}`}
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              판매자 프로필 보기 →
            </Link>
          </SellerSection>
        </InfoSection>
      </ProductSection>

      <DescriptionSection>
        <SectionTitle>상품 설명</SectionTitle>
        <Description>{product.description}</Description>

        <ProductDetails>
          <DetailItem>
            <DetailLabel>상품상태</DetailLabel>
            <DetailValue>{getConditionText(product.condition)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>거래방식</DetailLabel>
            <DetailValue>{product.negotiable ? '가격협상 가능' : '정가 판매'}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>카테고리</DetailLabel>
            <DetailValue>{product.category}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>등록일</DetailLabel>
            <DetailValue>{formatDate(product.createdAt)}</DetailValue>
          </DetailItem>
        </ProductDetails>
      </DescriptionSection>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <RelatedSection>
          <SectionTitle>비슷한 상품</SectionTitle>
          <RelatedGrid>
            {relatedProducts.map(relatedProduct => (
              <RelatedProductCard
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
              >
                <RelatedProductImage
                  image={getImageUrl((relatedProduct.images && relatedProduct.images[0]))}
                />
                <RelatedProductInfo>
                  <RelatedProductTitle>{relatedProduct.title}</RelatedProductTitle>
                  <RelatedProductPrice>
                    {formatPrice(relatedProduct.price)}
                  </RelatedProductPrice>
                  <LikeInfo>
                    <FiHeart size={12} />
                    {relatedProduct.likes || 0}
                  </LikeInfo>
                </RelatedProductInfo>
              </RelatedProductCard>
            ))}
          </RelatedGrid>
        </RelatedSection>
      )}

      {/* Image Modal */}
      <ImageModal
        show={showImageModal}
        onClick={() => setShowImageModal(false)}
      >
        <CloseModal onClick={(e) => {
          e.stopPropagation();
          setShowImageModal(false);
        }}>
          ×
        </CloseModal>
        {currentImage && (
          <ModalImage
            src={currentImage}
            alt={product.title}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </ImageModal>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        product={product}
        currentUser={user}
        onPurchase={handlePurchaseConfirm}
        isLoading={purchaseLoading}
      />
      
      <CreditInsufficientModal
        isOpen={showCreditModal}
        onClose={handleCreditModalClose}
        onRefresh={handleRefreshPage}
      />
    </Container>
  );
};

export default ProductDetailPage;