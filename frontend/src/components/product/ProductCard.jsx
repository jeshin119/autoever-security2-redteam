import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { formatPrice, timeAgo } from '../../utils/format';
import { getImageUrl } from '../../services/api';

const Card = styled(Link)`
  display: block;
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
  transition: ${props => props.theme.transitions.normal};
  cursor: pointer;
  width: 100%; /* Grid 컨테이너에 맞춤 */
  height: fit-content; /* 내용에 맞춤 */
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  padding-bottom: 100%; // 1:1 aspect ratio
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: ${props => props.theme.transitions.normal};
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  left: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => 
    props.status === 'sold' ? props.theme.colors.textSecondary :
    props.status === 'reserved' ? props.theme.colors.warning :
    props.theme.colors.success
  };
  color: white;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  padding: ${props => props.theme.spacing.md};
  min-height: 80px; /* 최소 높이 설정으로 일관성 유지 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductTitle = styled.h3`
  font-size: 0.875rem; /* 카드 크기에 맞게 폰트 크기 조정 */
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
`;

const ProductPrice = styled.div`
  font-size: 1rem; /* 카드 크기에 맞게 폰트 크기 조정 */
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem; /* 카드 크기에 맞게 폰트 크기 조정 */
  color: ${props => props.theme.colors.textSecondary};
  margin-top: auto; /* 하단에 배치 */
`;

const Location = styled.span`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%; /* 위치 텍스트가 너무 길어지지 않도록 */
`;

const Stats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  
  span {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing.xs};
    white-space: nowrap;
  }
`;

const PlaceholderImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textLight};
  font-size: 3rem;
`;

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

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = React.useState(false);
  const images = React.useMemo(() => toImagesArray(product.images), [product.images]);
  const firstImage = images[0];

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card to={`/products/${product.id}`}>
      <ImageContainer>
        {firstImage && !imageError ? (
          <ProductImage 
            src={getImageUrl(firstImage)} 
            alt={product.title}
            // Intentionally vulnerable: No image sanitization
            onError={handleImageError}
          />
        ) : (
          <PlaceholderImage>📦</PlaceholderImage>
        )}
        
        {product.status && product.status !== 'available' && (
          <StatusBadge status={product.status}>
            {product.status === 'sold' ? '판매완료' : '예약중'}
          </StatusBadge>
        )}
      </ImageContainer>
      
      <ProductInfo>
        <ProductTitle>{product.title}</ProductTitle>
        <ProductPrice>{formatPrice(product.price)}원</ProductPrice>
        <ProductMeta>
          <Location>
            📍 {product.location || '위치 미정'}
          </Location>
          <Stats>
            <span>❤️ {product.likes || 0}</span>
            <span>💬 {product.comments || 0}</span>
          </Stats>
        </ProductMeta>
        <ProductMeta style={{ marginTop: '4px' }}>
          <span>{timeAgo(product.createdAt)}</span>
        </ProductMeta>
      </ProductInfo>
    </Card>
  );
};

export default ProductCard;