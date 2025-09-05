import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiShoppingCart, FiCreditCard, FiUser, FiMapPin, FiAlertCircle, FiPhone, FiTag, FiTruck } from 'react-icons/fi';
import { getImageUrl, productService } from '../../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ProductSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: ${props => props.image ? `url(${props.image})` : '#f0f0f0'};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PaymentSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CreditInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CreditRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: 700;
    font-size: 1.1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e9ecef;
  }
`;

const CreditLabel = styled.span`
  color: ${props => props.theme.colors.text};
`;

const CreditAmount = styled.span`
  font-weight: 600;
  color: ${props => props.insufficient ? '#dc3545' : props.theme.colors.primary};
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  color: #856404;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
    }
    
    &:disabled {
      background: ${props.theme.colors.border};
      cursor: not-allowed;
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 60px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const CouponSection = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: end;
`;

const CouponInput = styled(Input)`
  flex: 1;
`;

const CouponButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const DeliveryOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const DeliveryOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
  background: ${props => props.selected ? props.theme.colors.primary + '10' : 'white'};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SummaryCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 0.75rem;
    border-top: 1px solid #e9ecef;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const DiscountText = styled.span`
  color: #dc3545;
  font-weight: 600;
`;

const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  product, 
  currentUser, 
  onPurchase, 
  isLoading 
}) => {
  // 구매 폼 상태
  const [deliveryInfo, setDeliveryInfo] = useState({
    recipientName: currentUser?.name || '',
    phone: currentUser?.phone || '',
    zipCode: '',
    address: '',
    detailAddress: '',
    deliveryRequest: ''
  });
  
  const [deliveryType, setDeliveryType] = useState('standard');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const userCredits = parseFloat((currentUser && currentUser.credits) || 0);
  const productPrice = parseFloat(product.price || 0);
  
  // 배송비 계산
  const deliveryFee = deliveryType === 'express' ? 5000 : 3000;
  
  // 할인 계산
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  
  // 총 금액 계산
  const totalBeforeDiscount = productPrice + deliveryFee;
  const totalAfterDiscount = totalBeforeDiscount - couponDiscount;
  const remainingCredits = userCredits - totalAfterDiscount;
  const hasInsufficientCredits = remainingCredits < 0;

  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      const response = await productService.validateCoupon(couponCode, productPrice);
      
      if (response.data.success) {
        setAppliedCoupon(response.data.data);
        alert('쿠폰이 적용되었습니다!');
      } else {
        alert(response.data.message || '유효하지 않은 쿠폰 코드입니다.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('쿠폰 적용 중 오류가 발생했습니다.');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePurchase = () => {
    // 필수 정보 검증
    const requiredFields = ['recipientName', 'phone', 'zipCode', 'address'];
    const missingFields = requiredFields.filter(field => !deliveryInfo[field].trim());
    
    if (missingFields.length > 0) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }
    
    // 구매 데이터 준비
    const purchaseData = {
      deliveryInfo,
      deliveryType,
      appliedCoupon,
      totalAmount: totalAfterDiscount,
      deliveryFee,
      discount: couponDiscount
    };
    
    onPurchase(purchaseData);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiShoppingCart />
            주문/결제
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* 상품 정보 */}
          <ProductSection>
            <ProductImage image={getImageUrl(product.images && product.images[0])} />
            <ProductInfo>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>{formatPrice(product.price)}</ProductPrice>
              <SellerInfo>
                <FiUser size={14} />
                {product.sellerName || '판매자'}
                <FiMapPin size={14} style={{ marginLeft: '0.5rem' }} />
                {product.location || '위치 미상'}
              </SellerInfo>
            </ProductInfo>
          </ProductSection>

          {/* 배송지 정보 */}
          <FormSection>
            <SectionTitle>
              <FiTruck />
              배송지 정보
            </SectionTitle>
            
            <InputGroup>
              <Label>받는 분 성함 *</Label>
              <Input
                type="text"
                value={deliveryInfo.recipientName}
                onChange={(e) => handleInputChange('recipientName', e.target.value)}
                placeholder="받는 분의 성함을 입력해주세요"
              />
            </InputGroup>

            <InputGroup>
              <Label>연락처 *</Label>
              <Input
                type="tel"
                value={deliveryInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="010-1234-5678"
              />
            </InputGroup>

            <InputGroup>
              <Label>우편번호 *</Label>
              <Input
                type="text"
                value={deliveryInfo.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="우편번호 입력"
              />
            </InputGroup>

            <InputGroup>
              <Label>주소 *</Label>
              <Input
                type="text"
                value={deliveryInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="기본 주소를 입력해주세요"
              />
            </InputGroup>

            <InputGroup>
              <Label>상세 주소</Label>
              <Input
                type="text"
                value={deliveryInfo.detailAddress}
                onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                placeholder="상세 주소를 입력해주세요"
              />
            </InputGroup>

            <InputGroup>
              <Label>배송 요청사항</Label>
              <TextArea
                value={deliveryInfo.deliveryRequest}
                onChange={(e) => handleInputChange('deliveryRequest', e.target.value)}
                placeholder="배송 시 요청사항이 있으시면 입력해주세요"
              />
            </InputGroup>
          </FormSection>

          {/* 배송 옵션 */}
          <FormSection>
            <SectionTitle>
              <FiTruck />
              배송 옵션
            </SectionTitle>
            
            <DeliveryOptions>
              <DeliveryOption selected={deliveryType === 'standard'}>
                <input
                  type="radio"
                  value="standard"
                  checked={deliveryType === 'standard'}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>일반배송</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    2-3일 소요 (+3,000원)
                  </div>
                </div>
              </DeliveryOption>
              
              <DeliveryOption selected={deliveryType === 'express'}>
                <input
                  type="radio"
                  value="express"
                  checked={deliveryType === 'express'}
                  onChange={(e) => setDeliveryType(e.target.value)}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>빠른배송</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    1-2일 소요 (+5,000원)
                  </div>
                </div>
              </DeliveryOption>
            </DeliveryOptions>
          </FormSection>

          {/* 쿠폰 */}
          <FormSection>
            <SectionTitle>
              <FiTag />
              할인쿠폰
            </SectionTitle>
            
            <CouponSection>
              <div style={{ flex: 1 }}>
                <CouponInput
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="쿠폰 코드를 입력하세요 (예: WELCOME10)"
                />
              </div>
              <CouponButton 
                onClick={handleCouponApply}
                disabled={couponLoading || !couponCode.trim()}
              >
                {couponLoading ? '확인중...' : '적용'}
              </CouponButton>
            </CouponSection>
            
            {appliedCoupon && (
              <div style={{ 
                marginTop: '0.5rem', 
                padding: '0.5rem', 
                background: '#d4edda', 
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                color: '#155724',
                fontSize: '0.9rem'
              }}>
                ✅ {appliedCoupon.name} 적용됨 (-{formatPrice(appliedCoupon.discount)})
              </div>
            )}
          </FormSection>

          {/* 결제 정보 */}
          <PaymentSection>
            <SectionTitle>
              <FiCreditCard />
              결제 정보
            </SectionTitle>
            
            <SummaryCard>
              <SummaryRow>
                <span>상품 금액</span>
                <span>{formatPrice(productPrice)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>배송비</span>
                <span>{formatPrice(deliveryFee)}</span>
              </SummaryRow>
              {appliedCoupon && (
                <SummaryRow>
                  <span>할인</span>
                  <DiscountText>-{formatPrice(couponDiscount)}</DiscountText>
                </SummaryRow>
              )}
              <SummaryRow>
                <span>총 결제금액</span>
                <span>{formatPrice(totalAfterDiscount)}</span>
              </SummaryRow>
            </SummaryCard>
            
            <CreditInfo>
              <CreditRow>
                <CreditLabel>보유 크레딧</CreditLabel>
                <CreditAmount>{formatPrice(userCredits)}</CreditAmount>
              </CreditRow>
              <CreditRow>
                <CreditLabel>결제 후 잔액</CreditLabel>
                <CreditAmount insufficient={hasInsufficientCredits}>
                  {formatPrice(remainingCredits)}
                </CreditAmount>
              </CreditRow>
            </CreditInfo>

            {hasInsufficientCredits && (
              <WarningMessage>
                <FiAlertCircle />
                크레딧이 부족합니다. 충전 후 다시 시도해주세요.
              </WarningMessage>
            )}
          </PaymentSection>

          <div style={{ 
            padding: '1rem', 
            background: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '6px', 
            fontSize: '0.9rem', 
            color: '#856404',
            textAlign: 'center'
          }}>
            ⚠️ 주의: 결제 후 취소/환불이 어려울 수 있습니다.
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>
            취소
          </Button>
          <Button 
            primary 
            onClick={handlePurchase}
            disabled={isLoading || hasInsufficientCredits}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                구매 중...
              </>
            ) : (
              `${formatPrice(totalAfterDiscount)} 결제하기`
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PurchaseModal;