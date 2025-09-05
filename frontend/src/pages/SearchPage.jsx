import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiFilter, FiMapPin, FiHeart, FiGrid, FiList } from 'react-icons/fi';
import { productService, getImageUrl } from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const SearchHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 50px;
  font-size: 1.1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: end;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  min-width: 0;
  
  &:nth-child(3) {
    /* 가격범위 필터는 더 넓은 공간 필요 */
    grid-column: span 1;
  }
  
  &:nth-child(5) {
    /* 필터 적용 버튼은 별도 행에 배치 */
    grid-column: span 4;
    
    @media (max-width: 1200px) {
      grid-column: span 2;
    }
    
    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }
`;

const FilterLabel = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 0;
  box-sizing: border-box;
`;

const PriceInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;
  min-width: 0;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    
    span {
      display: none;
    }
  }
`;

const PriceInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 0;
  box-sizing: border-box;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const ResultsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ResultsInfo = styled.div`
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
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.backgroundSecondary};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr'};
  gap: 1.5rem;
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
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
  
  .list-view & {
    width: 200px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const SearchPage = () => {
  const location = useLocation();
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  // Create searchParams object from location.search
  const searchParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    location: '',
    sortBy: 'latest'
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

  const conditions = [
    { value: '', label: '전체' },
    { value: 'like-new', label: '거의 새것' },
    { value: 'good', label: '좋음' },
    { value: 'fair', label: '보통' },
    { value: 'poor', label: '나쁨' }
  ];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'price-low', label: '낮은가격순' },
    { value: 'price-high', label: '높은가격순' },
    { value: 'popular', label: '인기순' }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);
    if (query) {
      performSearch();
    }
  }, [location.search]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(location.search);
      const query = urlParams.get('q') || ''; // URL 파라미터에서 검색어 가져오기
      
      console.log('🔍 Performing search with query:', query); // 디버깅용 로그
      
      const response = await productService.searchProducts({
        search: query,
        ...filters
      });
      
      // Backend returns: { success: true, data: [...], pagination: {...} }
      setProducts((response.data && response.data.data) || []);
    } catch (error) {
      console.error('Search failed:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
    const newParams = new URLSearchParams();
    newParams.set('q', searchQuery.trim());
    history.push(`${location.pathname}?${newParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
      // Enter 키 입력 시에도 검색창 초기화 (handleSearch에서 처리됨)
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    performSearch();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <Container>
      <SearchHeader>
        <h1 style={{ marginBottom: '1rem' }}>상품 검색</h1>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="찾으시는 상품을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>
            <FiSearch />
          </SearchButton>
        </SearchBox>
      </SearchHeader>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>카테고리</FilterLabel>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>상품상태</FilterLabel>
            <Select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
            >
              {conditions.map(cond => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>가격범위</FilterLabel>
            <PriceInputs>
              <PriceInput
                type="number"
                placeholder="최소"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
              <span>~</span>
              <PriceInput
                type="number"
                placeholder="최대"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
            </PriceInputs>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>정렬</FilterLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {sortOptions.map(sort => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterButton onClick={applyFilters}>
              <FiFilter />
              필터 적용
            </FilterButton>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      <ResultsSection>
        <ResultsInfo>
          {searchParams.get('q') && `"${searchParams.get('q')}" 검색결과 `}
          총 {products.length}개의 상품
        </ResultsInfo>
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
      </ResultsSection>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          검색 중...
        </div>
      ) : products.length === 0 ? (
        <EmptyState>
          <h3>검색 결과가 없습니다</h3>
          <p>다른 검색어나 필터를 시도해보세요</p>
        </EmptyState>
      ) : (
        <ProductGrid viewMode={viewMode}>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              to={`/products/${product.id}`}
              className={viewMode === 'list' ? 'list-view' : ''}
            >
              <ProductImage 
                image={getImageUrl((product.images && product.images[0]))} 
                imageError={imageErrors[product.id]}
                onError={() => handleImageError(product.id)}
              />
              
              <ProductInfo>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>{formatPrice(product.price)}</ProductPrice>
                <ProductMeta>
                  <span>
                    <FiMapPin size={12} /> {product.location}
                  </span>
                  <span>{product.category}</span>
                </ProductMeta>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </Container>
  );
};

export default SearchPage;