import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const Container = styled.div`
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const SearchSection = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  flex: 1;
  max-width: 300px;
`;

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: white;
`;

const TableContainer = styled.div`
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    if (props.status === 'active') return '#10b981';
    if (props.status === 'pending') return '#f59e0b';
    if (props.status === 'rejected') return '#ef4444';
    if (props.status === 'sold') return '#6b7280';
    return '#6b7280';
  }};
  color: white;
`;

const CategoryBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  background: #8b5cf6;
  color: white;
`;

const ActionButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  cursor: pointer;
  margin-right: ${props => props.theme.spacing.xs};
  transition: ${props => props.theme.transitions.fast};
  
  &.approve {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.reject {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  &.edit {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.delete {
    background: #6b7280;
    color: white;
    
    &:hover {
      background: #4b5563;
    }
  }
`;

const Modal = styled.div`
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
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &.primary {
    background: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.colors.primaryDark};
    }
  }
  
  &.secondary {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
    
    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const ProductManagementPage = ({ onBack }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const loadProducts = async () => {
    try {
      // 실제 구현에서는 API 호출
      const mockProducts = [
        {
          id: 1,
          title: '아이폰 14 Pro 128GB - 거의 새것',
          description: '작년에 구입한 아이폰 14 Pro입니다. 케이스 끼고 사용해서 스크래치 거의 없어요.',
          price: 950000,
          category: '디지털/가전',
          condition: 'like-new',
          location: '서울시 서초구',
          status: 'active',
          seller: '김철수',
          sellerEmail: 'kim@example.com',
          createdAt: '2024-01-15',
          images: ['/uploads/phone1.jpg', '/uploads/phone2.jpg']
        },
        {
          id: 2,
          title: '북유럽 원목 식탁 4인용',
          description: '이사로 인해 판매합니다. 사용한지 1년 정도 되었고 상태 양호합니다.',
          price: 150000,
          category: '가구/인테리어',
          condition: 'good',
          location: '부산시 해운대구',
          status: 'pending',
          seller: '이영희',
          sellerEmail: 'lee@example.com',
          createdAt: '2024-01-14',
          images: ['/uploads/table1.jpg']
        },
        {
          id: 3,
          title: '옛날 카메라 - 컬렉션용',
          description: '할아버지가 사용하던 필름 카메라입니다. 작동 상태는 확인되지 않았습니다.',
          price: 200000,
          category: '수집품/골동품',
          condition: 'unknown',
          location: '대구시 중구',
          status: 'rejected',
          seller: '박민수',
          sellerEmail: 'park@example.com',
          createdAt: '2024-01-13',
          images: ['/uploads/camera1.jpg']
        },
        {
          id: 4,
          title: '클래식 시계 - 오메가',
          description: '정품 오메가 시계입니다. 박스와 보증서 모두 포함되어 있습니다.',
          price: 1200000,
          category: '패션/액세서리',
          condition: 'excellent',
          location: '인천시 연수구',
          status: 'sold',
          seller: '최지영',
          sellerEmail: 'choi@example.com',
          createdAt: '2024-01-12',
          images: ['/uploads/watch1.jpg']
        },
        {
          id: 5,
          title: '빈티지 책상 - 1950년대',
          description: '1950년대 제작된 원목 책상입니다. 클래식한 디자인이 매력적입니다.',
          price: 300000,
          category: '가구/인테리어',
          condition: 'fair',
          location: '광주시 서구',
          status: 'active',
          seller: '정현우',
          sellerEmail: 'jung@example.com',
          createdAt: '2024-01-11',
          images: ['/uploads/desk1.jpg']
        }
      ];
      
      setProducts(mockProducts);
      setLoading(false);
    } catch (error) {
      console.error('Products loading error:', error);
      toast.error('상품 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredProducts(filtered);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleApprove = async (productId) => {
    try {
      // 실제 구현에서는 API 호출
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, status: 'active' }
          : product
      ));
      toast.success('상품이 승인되었습니다.');
    } catch (error) {
      console.error('Product approval error:', error);
      toast.error('상품 승인에 실패했습니다.');
    }
  };

  const handleReject = async (productId) => {
    try {
      // 실제 구현에서는 API 호출
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, status: 'rejected' }
          : product
      ));
      toast.success('상품이 거부되었습니다.');
    } catch (error) {
      console.error('Product rejection error:', error);
      toast.error('상품 거부에 실패했습니다.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        // 실제 구현에서는 API 호출
        setProducts(products.filter(product => product.id !== productId));
        toast.success('상품이 삭제되었습니다.');
      } catch (error) {
        console.error('Product deletion error:', error);
        toast.error('상품 삭제에 실패했습니다.');
      }
    }
  };

  const handleSave = async (productData) => {
    try {
      // 실제 구현에서는 API 호출
      if (editingProduct) {
        setProducts(products.map(product => 
          product.id === editingProduct.id ? { ...product, ...productData } : product
        ));
        toast.success('상품 정보가 수정되었습니다.');
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Product update error:', error);
      toast.error('상품 정보 수정에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>🛍️ 상품 관리</Title>
        <Button className="secondary" onClick={onBack}>
          ← 대시보드로 돌아가기
        </Button>
      </Header>

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="상품명 또는 설명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">모든 카테고리</option>
          <option value="디지털/가전">디지털/가전</option>
          <option value="가구/인테리어">가구/인테리어</option>
          <option value="수집품/골동품">수집품/골동품</option>
          <option value="패션/액세서리">패션/액세서리</option>
        </FilterSelect>
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">모든 상태</option>
          <option value="active">승인됨</option>
          <option value="pending">검토중</option>
          <option value="rejected">거부됨</option>
          <option value="sold">판매완료</option>
        </FilterSelect>
      </SearchSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>상품명</Th>
              <Th>카테고리</Th>
              <Th>가격</Th>
              <Th>상태</Th>
              <Th>판매자</Th>
              <Th>등록일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      {product.description.substring(0, 50)}...
                    </div>
                  </div>
                </Td>
                <Td>
                  <CategoryBadge>{product.category}</CategoryBadge>
                </Td>
                <Td>₩{product.price.toLocaleString()}</Td>
                <Td>
                  <StatusBadge status={product.status}>
                    {product.status === 'active' ? '승인됨' : 
                     product.status === 'pending' ? '검토중' : 
                     product.status === 'rejected' ? '거부됨' : '판매완료'}
                  </StatusBadge>
                </Td>
                <Td>
                  <div>
                    <div>{product.seller}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {product.sellerEmail}
                    </div>
                  </div>
                </Td>
                <Td>{product.createdAt}</Td>
                <Td>
                  {product.status === 'pending' && (
                    <>
                      <ActionButton className="approve" onClick={() => handleApprove(product.id)}>
                        승인
                      </ActionButton>
                      <ActionButton className="reject" onClick={() => handleReject(product.id)}>
                        거부
                      </ActionButton>
                    </>
                  )}
                  <ActionButton className="edit" onClick={() => handleEdit(product)}>
                    수정
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => handleDelete(product.id)}>
                    삭제
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>상품 정보 수정</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>상품명</Label>
              <Input
                type="text"
                value={(editingProduct && editingProduct.title) || ''}
                onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>설명</Label>
              <Textarea
                value={(editingProduct && editingProduct.description) || ''}
                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>가격</Label>
              <Input
                type="number"
                value={(editingProduct && editingProduct.price) || 0}
                onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>카테고리</Label>
              <Select
                value={(editingProduct && editingProduct.category) || ''}
                onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
              >
                <option value="디지털/가전">디지털/가전</option>
                <option value="가구/인테리어">가구/인테리어</option>
                <option value="수집품/골동품">수집품/골동품</option>
                <option value="패션/액세서리">패션/액세서리</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>상태</Label>
              <Select
                value={(editingProduct && editingProduct.status) || 'pending'}
                onChange={(e) => setEditingProduct({...editingProduct, status: e.target.value})}
              >
                <option value="pending">검토중</option>
                <option value="active">승인됨</option>
                <option value="rejected">거부됨</option>
                <option value="sold">판매완료</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>위치</Label>
              <Input
                type="text"
                value={(editingProduct && editingProduct.location) || ''}
                onChange={(e) => setEditingProduct({...editingProduct, location: e.target.value})}
              />
            </FormGroup>
            
            <ButtonGroup>
              <Button className="secondary" onClick={handleCloseModal}>
                취소
              </Button>
              <Button className="primary" onClick={() => handleSave(editingProduct)}>
                저장
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ProductManagementPage;
