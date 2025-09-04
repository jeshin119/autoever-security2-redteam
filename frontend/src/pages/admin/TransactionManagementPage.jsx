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
    if (props.status === 'completed') return '#10b981';
    if (props.status === 'in_progress') return '#3b82f6';
    if (props.status === 'cancelled') return '#ef4444';
    if (props.status === 'disputed') return '#f59e0b';
    if (props.status === 'pending') return '#8b5cf6';
    return '#6b7280';
  }};
  color: white;
`;

const PaymentMethodBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  background: #6366f1;
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
  
  &.view {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.resolve {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.cancel {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
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
  max-width: 700px;
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const InfoSection = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const InfoTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
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

const TransactionManagementPage = ({ onBack }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, paymentFilter]);

  const loadTransactions = async () => {
    try {
      // 실제 구현에서는 API 호출
      const mockTransactions = [
        {
          id: 'TXN001',
          productTitle: '아이폰 14 Pro 128GB - 거의 새것',
          buyer: '김구매',
          buyerEmail: 'buyer1@example.com',
          seller: '김철수',
          sellerEmail: 'kim@example.com',
          amount: 950000,
          paymentMethod: 'card',
          status: 'completed',
          createdAt: '2024-01-20',
          completedAt: '2024-01-22',
          location: '서울시 서초구',
          notes: '매우 만족스러운 거래였습니다.'
        },
        {
          id: 'TXN002',
          productTitle: '북유럽 원목 식탁 4인용',
          buyer: '이소비자',
          buyerEmail: 'buyer2@example.com',
          seller: '이영희',
          sellerEmail: 'lee@example.com',
          amount: 150000,
          paymentMethod: 'transfer',
          status: 'in_progress',
          createdAt: '2024-01-19',
          location: '부산시 해운대구',
          notes: '배송 중입니다.'
        },
        {
          id: 'TXN003',
          productTitle: '옛날 카메라 - 컬렉션용',
          buyer: '박수집가',
          buyerEmail: 'buyer3@example.com',
          seller: '박민수',
          sellerEmail: 'park@example.com',
          amount: 200000,
          paymentMethod: 'card',
          status: 'disputed',
          createdAt: '2024-01-18',
          location: '대구시 중구',
          notes: '상품 상태가 설명과 다릅니다.'
        },
        {
          id: 'TXN004',
          productTitle: '클래식 시계 - 오메가',
          buyer: '최시계애호가',
          buyerEmail: 'buyer4@example.com',
          seller: '최지영',
          sellerEmail: 'choi@example.com',
          amount: 1200000,
          paymentMethod: 'card',
          status: 'completed',
          createdAt: '2024-01-17',
          completedAt: '2024-01-20',
          location: '인천시 연수구',
          notes: '정품 확인 완료, 만족합니다.'
        },
        {
          id: 'TXN005',
          productTitle: '빈티지 책상 - 1950년대',
          buyer: '정인테리어',
          buyerEmail: 'buyer5@example.com',
          seller: '정현우',
          sellerEmail: 'jung@example.com',
          amount: 300000,
          paymentMethod: 'transfer',
          status: 'cancelled',
          createdAt: '2024-01-16',
          cancelledAt: '2024-01-18',
          location: '광주시 서구',
          notes: '구매자 요청으로 취소됨'
        }
      ];
      
      setTransactions(mockTransactions);
      setLoading(false);
    } catch (error) {
      console.error('Transactions loading error:', error);
      toast.error('거래 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.seller.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || transaction.paymentMethod === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
    
    setFilteredTransactions(filtered);
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleResolveDispute = async (transactionId) => {
    try {
      // 실제 구현에서는 API 호출
      setTransactions(transactions.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, status: 'completed' }
          : transaction
      ));
      toast.success('분쟁이 해결되었습니다.');
      setShowModal(false);
    } catch (error) {
      console.error('Dispute resolution error:', error);
      toast.error('분쟁 해결에 실패했습니다.');
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    if (window.confirm('정말로 이 거래를 취소하시겠습니까?')) {
      try {
        // 실제 구현에서는 API 호출
        setTransactions(transactions.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, status: 'cancelled', cancelledAt: new Date().toISOString().split('T')[0] }
            : transaction
        ));
        toast.success('거래가 취소되었습니다.');
        setShowModal(false);
      } catch (error) {
        console.error('Transaction cancellation error:', error);
        toast.error('거래 취소에 실패했습니다.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in_progress': return '진행중';
      case 'cancelled': return '취소됨';
      case 'disputed': return '분쟁';
      case 'pending': return '대기중';
      default: return status;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'card': return '카드';
      case 'transfer': return '계좌이체';
      case 'cash': return '현금';
      default: return method;
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>💰 거래 관리</Title>
        <Button className="secondary" onClick={onBack}>
          ← 대시보드로 돌아가기
        </Button>
      </Header>

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="상품명, 구매자, 판매자로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">모든 상태</option>
          <option value="completed">완료</option>
          <option value="in_progress">진행중</option>
          <option value="pending">대기중</option>
          <option value="disputed">분쟁</option>
          <option value="cancelled">취소됨</option>
        </FilterSelect>
        <FilterSelect value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="all">모든 결제방법</option>
          <option value="card">카드</option>
          <option value="transfer">계좌이체</option>
          <option value="cash">현금</option>
        </FilterSelect>
      </SearchSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>거래ID</Th>
              <Th>상품명</Th>
              <Th>구매자</Th>
              <Th>판매자</Th>
              <Th>금액</Th>
              <Th>결제방법</Th>
              <Th>상태</Th>
              <Th>거래일</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <Td>{transaction.id}</Td>
                <Td>
                  <div style={{ fontWeight: '600' }}>
                    {transaction.productTitle}
                  </div>
                </Td>
                <Td>
                  <div>
                    <div>{transaction.buyer}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {transaction.buyerEmail}
                    </div>
                  </div>
                </Td>
                <Td>
                  <div>
                    <div>{transaction.seller}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {transaction.sellerEmail}
                    </div>
                  </div>
                </Td>
                <Td>₩{transaction.amount.toLocaleString()}</Td>
                <Td>
                  <PaymentMethodBadge>
                    {getPaymentMethodText(transaction.paymentMethod)}
                  </PaymentMethodBadge>
                </Td>
                <Td>
                  <StatusBadge status={transaction.status}>
                    {getStatusText(transaction.status)}
                  </StatusBadge>
                </Td>
                <Td>{transaction.createdAt}</Td>
                <Td>
                  <ActionButton className="view" onClick={() => handleViewDetails(transaction)}>
                    상세보기
                  </ActionButton>
                  {transaction.status === 'disputed' && (
                    <ActionButton className="resolve" onClick={() => handleResolveDispute(transaction.id)}>
                      해결
                    </ActionButton>
                  )}
                  {transaction.status === 'in_progress' && (
                    <ActionButton className="cancel" onClick={() => handleCancelTransaction(transaction.id)}>
                      취소
                    </ActionButton>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {showModal && selectedTransaction && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>거래 상세 정보 - {selectedTransaction.id}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            <InfoGrid>
              <InfoSection>
                <InfoTitle>상품 정보</InfoTitle>
                <InfoText>{selectedTransaction.productTitle}</InfoText>
                <InfoText>위치: {selectedTransaction.location}</InfoText>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>거래 정보</InfoTitle>
                <InfoText>거래ID: {selectedTransaction.id}</InfoText>
                <InfoText>금액: ₩{selectedTransaction.amount.toLocaleString()}</InfoText>
                <InfoText>결제방법: {getPaymentMethodText(selectedTransaction.paymentMethod)}</InfoText>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>구매자 정보</InfoTitle>
                <InfoText>이름: {selectedTransaction.buyer}</InfoText>
                <InfoText>이메일: {selectedTransaction.buyerEmail}</InfoText>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>판매자 정보</InfoTitle>
                <InfoText>이름: {selectedTransaction.seller}</InfoText>
                <InfoText>이메일: {selectedTransaction.sellerEmail}</InfoText>
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>거래 상태</InfoTitle>
                <InfoText>상태: {getStatusText(selectedTransaction.status)}</InfoText>
                <InfoText>생성일: {selectedTransaction.createdAt}</InfoText>
                {selectedTransaction.completedAt && (
                  <InfoText>완료일: {selectedTransaction.completedAt}</InfoText>
                )}
                {selectedTransaction.cancelledAt && (
                  <InfoText>취소일: {selectedTransaction.cancelledAt}</InfoText>
                )}
              </InfoSection>
              
              <InfoSection>
                <InfoTitle>비고</InfoTitle>
                <InfoText>{selectedTransaction.notes || '없음'}</InfoText>
              </InfoSection>
            </InfoGrid>
            
            <ButtonGroup>
              {selectedTransaction.status === 'disputed' && (
                <Button className="primary" onClick={() => handleResolveDispute(selectedTransaction.id)}>
                  분쟁 해결
                </Button>
              )}
              {selectedTransaction.status === 'in_progress' && (
                <Button className="primary" onClick={() => handleCancelTransaction(selectedTransaction.id)}>
                  거래 취소
                </Button>
              )}
              <Button className="secondary" onClick={handleCloseModal}>
                닫기
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default TransactionManagementPage;
