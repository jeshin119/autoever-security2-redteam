import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiUpload, FiX, FiMapPin, FiDollarSign, FiTag } from 'react-icons/fi';
import { productService, getImageUrl, uploadService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #dc3545;
    }
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ImageUploadSection = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ImageUploadText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 1rem;
  
  .main {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .sub {
    font-size: 0.9rem;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: ${props => props.theme.colors.backgroundSecondary};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0,0,0,0.9);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PriceInput = styled.div`
  position: relative;
`;

const PriceIcon = styled(FiDollarSign)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const PriceInputField = styled(Input)`
  padding-left: 2.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  min-width: 120px;
  
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
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ProductCreatePage = () => {
  const history = useHistory();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good',
    location: '',
    negotiable: true,
    images: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const isMountedRef = useRef(true);

  const categories = [
    '디지털/가전',
    '가구/인테리어',
    '패션/의류',
    '생활가전',
    '스포츠/레저',
    '도서/음반',
    '기타'
  ];

  const conditions = [
    { value: 'like_new', label: '거의 새것' },
    { value: 'good', label: '좋음' },
    { value: 'fair', label: '보통' },
    { value: 'poor', label: '나쁨' }
  ];

  useEffect(() => {
    isMountedRef.current = true;

    if (!user) {
      history.push('/login');
      return;
    }

    if (isEdit) {
      fetchProduct();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, id, isEdit]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      // 백엔드가 { success, data } 래핑/비래핑 둘 다 올 수 있어 호환 처리
      const product = (response && response.data && response.data.data) || (response && response.data);

      // 소유자 확인: 숫자 비교로 안전하게 처리
      const ownerId = Number((product && product.userId) || (product && product.sellerId) || (product && product.seller_id));
      if (ownerId && user && Number(user.id) !== ownerId) {
        navigate('/');
        return;
      }

      // images가 TEXT(JSON 문자열)일 수 있어 안전 파싱
      const imagesRaw = (product && product.images) || [];
      const imagesArr = Array.isArray(imagesRaw)
        ? imagesRaw
        : (typeof imagesRaw === 'string'
          ? (() => { try { return JSON.parse(imagesRaw || '[]'); } catch { return []; } })()
          : []);

      // negotiable이 '0'/'1'/'true'/'false'로 올 수도 있어 정규화
      const negotiable =
        (product && product.negotiable === true) ||
        (product && product.negotiable === 'true') ||
        (product && product.negotiable === 1) ||
        (product && product.negotiable === '1');

      setFormData({
        title: (product && product.title) || '',
        description: (product && product.description) || '',
        price: ((product && product.price) || '').toString(),
        category: (product && product.category) || '',
        // condition / conditionStatus / condition_status 모두 대응
        condition: (product && product.condition) || (product && product.conditionStatus) || (product && product.condition_status) || 'good',
        location: (product && product.location) || '',
        negotiable,
        images: imagesArr,
      });
    } catch (error) {
      console.error('Failed to fetch product:', error);
      if (isMountedRef.current) {
        navigate('/');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = formData.images.length + imageFiles.length + files.length;

    if (totalImages > 10) {
      alert('이미지는 최대 10개까지 업로드할 수 있습니다.');
      return;
    }

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageFiles(prev => [...prev, {
            file,
            preview: e.target.result,
            id: Date.now() + Math.random()
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = async (imageId, isExisting = false) => {
    try {
      if (isExisting) {
        // For existing images, extract filename from the image path
        const imageToRemove = formData.images[imageId];
        if (imageToRemove) {
          // Extract filename from URL (e.g., "/uploads/filename.jpg" -> "filename.jpg")
          const filename = imageToRemove.split('/').pop();
          
          // Delete file from server
          await uploadService.deleteFile(filename);
          console.log(`Existing image deleted from server: ${filename}`);
        }
        
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, index) => index !== imageId)
        }));
      } else {
        // For new images, they haven't been uploaded to server yet, so just remove from state
        setImageFiles(prev => prev.filter(img => img.id !== imageId));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // Even if server deletion fails, remove from UI state
      if (isExisting) {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, index) => index !== imageId)
        }));
      } else {
        setImageFiles(prev => prev.filter(img => img.id !== imageId));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '상품명을 입력해주세요.';
    }

    if (!formData.description.trim()) {
      newErrors.description = '상품 설명을 입력해주세요.';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (!formData.location.trim()) {
      newErrors.location = '거래 지역을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        price: parseInt(formData.price, 10),
        userid: user && user.id
      };

      if (isEdit) {
        // 수정 모드에서는 기존 이미지 정보를 유지
        if (imageFiles.length === 0) {
          // 새로운 이미지 파일이 없으면 기존 이미지 유지
          submitData.images = formData.images;
        }
        // 새로운 이미지 파일이 있으면 productService에서 처리
        
        await productService.updateProduct(id, submitData, imageFiles);
        alert('상품이 수정되었습니다.');
        history.push(`/products/${id}`);
      } else {
        // 새 상품 등록 모드
        if (imageFiles.length === 0) {
          submitData.images = formData.images;
        }
        
        const response = await productService.createProduct(submitData, imageFiles);
        alert('상품이 등록되었습니다.');
        const newId = (response && response.data && response.data.id) || (response && response.data && response.data.data && response.data.data.id);
        history.push(`/products/${newId}`);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      if (isMountedRef.current) {
        alert('상품 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  if (loading && isEdit) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          상품 정보를 불러오는 중...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{isEdit ? '상품 수정' : '상품 등록'}</Title>
        <Subtitle>
          {isEdit ? '상품 정보를 수정해주세요' : '판매할 상품의 정보를 입력해주세요'}
        </Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <Label required>상품 이미지</Label>
          <ImageUploadSection onClick={() => document.getElementById('image-upload').click()}>
            <FiUpload size={48} color="#6c757d" />
            <ImageUploadText>
              <div className="main">이미지를 선택해주세요</div>
              <div className="sub">최대 10장까지 업로드 가능합니다</div>
            </ImageUploadText>
          </ImageUploadSection>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          {(formData.images.length > 0 || imageFiles.length > 0) && (
            <ImagePreviewGrid>
              {formData.images.map((img, index) => (
                <ImagePreview key={`existing-${index}`}>
                  <img src={getImageUrl(img)} alt={`상품 이미지 ${index + 1}`} />
                  <RemoveImageButton onClick={() => removeImage(index, true)}>
                    <FiX size={12} />
                  </RemoveImageButton>
                </ImagePreview>
              ))}
              {imageFiles.map((img) => (
                <ImagePreview key={img.id}>
                  <img src={img.preview} alt="미리보기" />
                  <RemoveImageButton onClick={() => removeImage(img.id, false)}>
                    <FiX size={12} />
                  </RemoveImageButton>
                </ImagePreview>
              ))}
            </ImagePreviewGrid>
          )}
        </FormSection>

        <FormSection>
          <Label required>상품명</Label>
          <Input
            type="text"
            placeholder="상품명을 입력해주세요"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormSection>

        <FormGrid>
          <FormSection>
            <Label required>카테고리</Label>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">카테고리 선택</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
            {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
          </FormSection>

          <FormSection>
            <Label required>상품 상태</Label>
            <Select
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
            >
              {conditions.map(cond => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </Select>
          </FormSection>
        </FormGrid>

        <FormSection>
          <Label required>가격</Label>
          <PriceInput>
            <PriceInputField
              type="number"
              placeholder="가격을 입력해주세요"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
            />
          </PriceInput>
          {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}

          <CheckboxGroup style={{ marginTop: '0.5rem' }}>
            <Checkbox
              type="checkbox"
              id="negotiable"
              checked={formData.negotiable}
              onChange={(e) => handleInputChange('negotiable', e.target.checked)}
            />
            <CheckboxLabel htmlFor="negotiable">
              가격 협상 가능
            </CheckboxLabel>
          </CheckboxGroup>
        </FormSection>

        <FormSection>
          <Label required>거래 지역</Label>
          <Input
            type="text"
            placeholder="예: 서울시 강남구"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
        </FormSection>

        <FormSection>
          <Label required>상품 설명</Label>
          <TextArea
            placeholder="상품에 대한 자세한 설명을 입력해주세요"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormSection>

        <ButtonGroup>
          <Button type="button" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" primary disabled={loading}>
            {loading ? '처리중...' : (isEdit ? '수정하기' : '등록하기')}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default ProductCreatePage;