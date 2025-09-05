import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiGrid, FiList, FiSearch, FiFilter, FiMapPin, FiHeart } from 'react-icons/fi';
import { productService, getImageUrl } from '../services/api';

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  @media (max-width: 768px) {
    order: 2;
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  padding-right: 4.5rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  input {
    margin: 0;
  }
`;

const MainArea = styled.div``;

const ToolBar = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ResultInfo = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.backgroundSecondary};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  &.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  &.list-view {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(Link)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: block;
  
  &.list-view {
    display: flex;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  
  &.list-view {
    width: 200px;
  }
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
    switch (props.status) {
      case 'sold': return '#dc3545';
      case 'reserved': return '#fd7e14';
      default: return '#28a745';
    }
  }};
  color: white;
`;

const LikeButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
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
  flex: 1;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.3;
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const normalizeCondition = (v) => (v === 'like-new' ? 'like_new' : (v || ''));

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

const ProductListPage = () => {
  const location = useLocation();
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    condition: '',
    priceMin: '',
    priceMax: '',
    location: ''
  });

  const categories = [
    'All Categories',
    '디지털/가전',
    '가구/인테리어',
    '패션/의류',
    '생활가전',
    '스포츠/레저',
    '도서/음반',
    '기타'
  ];

  const conditionOptions = [
    { value: '', label: '전체' },
    { value: 'like_new', label: '거의 새것' },
    { value: 'good', label: '좋음' },
    { value: 'fair', label: '보통' },
    { value: 'poor', label: '나쁨' },
  ];

  // 초기 로드 시 상품 목록 가져오기
  useEffect(() => {
    console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    fetchProducts();
  }, []); // 초기 로드만 실행

  // URL 파라미터 변경 감지
  useEffect(() => {
    // URL에서 필터 값 가져오기
    const urlParams = new URLSearchParams(location.search);
    const category = urlParams.get('category') || '';
    const search = urlParams.get('search') || '';
    const condition = urlParams.get('condition') || '';
    const locationParam = urlParams.get('location') || '';

    // 필터 상태 업데이트
    setFilters({
      search: search,
      category: category || 'All Categories',
      condition: condition,
      priceMin: '',
      priceMax: '',
      location: locationParam
    });
  }, [location.search]); // location.search 변경 시 실행

  // 검색어 제외한 필터 상태 변경 시 상품 목록 가져오기
  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.condition, filters.location]); // search 제외한 필터만 감지

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiCondition = normalizeCondition(filters.condition);
      const response = await productService.getProducts({
        search: filters.search,
        category: filters.category !== 'All Categories' ? filters.category : '',
        condition: apiCondition,
        location: filters.location
      });
      setProducts((response.data && response.data.data) || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // 검색어가 아닌 필터 변경 시에만 즉시 URL 업데이트
    if (key !== 'search') {
      const newParams = new URLSearchParams();
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v && v !== 'All Categories' && v !== '전체') {
          newParams.set(k, v);
        }
      });
      history.push(`?${newParams.toString()}`);
    }
  };

  // Enter 키 이벤트 처리
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const newParams = new URLSearchParams();
    if (filters.search) {
      newParams.set('search', filters.search);
    }
    if (filters.category && filters.category !== 'All Categories') {
      newParams.set('category', filters.category);
    }
    if (filters.condition && filters.condition !== '전체') {
      newParams.set('condition', filters.condition);
    }
    if (filters.location) {
      newParams.set('location', filters.location);
    }
    history.push(`?${newParams.toString()}`);

    // 검색 실행
    fetchProducts();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const getStatusText = (isSold) => {
    return isSold ? '판매완료' : '판매중';
  };

  const getConditionText = (condition) => {
    switch (condition) {
      case 'like_new':
      case 'like-new':
        return '거의 새것';
      case 'good': return '좋음';
      case 'fair': return '보통';
      case 'poor': return '나쁨';
      default: return condition;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>상품을 불러오는 중...</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>중고거래</Title>
          <Subtitle>믿을 수 있는 중고거래, 빈티지 마켓에서 안전하게</Subtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        <Sidebar>
          <FilterSection>
            <FilterTitle>
              <FiSearch />
              검색
            </FilterTitle>
            <SearchBox>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="상품명을 입력하세요"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <SearchButton onClick={handleSearch}>검색</SearchButton>
            </SearchBox>
          </FilterSection>

          <FilterSection>
            <FilterTitle>
              <FiFilter />
              필터
            </FilterTitle>

            <FilterGroup>
              <FilterLabel>카테고리</FilterLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>상품상태</FilterLabel>
              <Select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
              >
                {conditionOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>지역</FilterLabel>
              <SearchInput
                type="text"
                placeholder="지역을 입력하세요"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </FilterGroup>
          </FilterSection>
        </Sidebar>

        <MainArea>
          <ToolBar>
            <ResultInfo>
              총 {products.length}개의 상품
            </ResultInfo>
            <ViewToggle>
              <ViewButton
                active={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </ViewButton>
              <ViewButton
                active={viewMode === 'list'}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </ViewButton>
            </ViewToggle>
          </ToolBar>

          {products.length === 0 ? (
            <EmptyState>
              <h3>등록된 상품이 없습니다</h3>
              <p>다른 검색 조건을 시도해보세요</p>
            </EmptyState>
          ) : (
            <ProductGrid className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  to={`/products/${product.id}`}
                  className={viewMode === 'list' ? 'list-view' : ''}
                >
                  <ProductImage
                    style={{
                      backgroundImage: `url(${getImageUrl(toImagesArray(product.images)[0])})`,
                      backgroundColor: '#f5f5f5'
                    }}
                    className={viewMode === 'list' ? 'list-view' : ''}
                  >
                    <StatusBadge status={product.isSold ? 'sold' : 'available'}>
                      {getStatusText(product.isSold)}
                    </StatusBadge>
                    <LikeButton onClick={(e) => e.preventDefault()}>
                      <FiHeart />
                    </LikeButton>
                  </ProductImage>

                  <ProductInfo>
                    <ProductTitle>{product.title}</ProductTitle>
                    <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                    <ProductMeta>
                      <Location>
                        <FiMapPin size={14} />
                        {product.location}
                      </Location>
                      <span>{getConditionText(product.condition)}</span>
                    </ProductMeta>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductGrid>
          )}
        </MainArea>
      </MainContent>
    </Container>
  );
};

export default ProductListPage;