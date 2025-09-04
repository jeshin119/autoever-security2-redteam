import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiShoppingBag, FiCreditCard, FiCalendar, FiMapPin, FiCheck, FiClock, FiX, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { transactionService, getImageUrl } from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const TabsContainer = styled.div`
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

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  flex-shrink: 0;
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const TransactionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'completed': return '#28a745';
      case 'pending': return '#fd7e14';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
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

const TransactionPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('purchases');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock transaction data
  const mockTransactions = {
    purchases: [
      {
        id: 1,
        productTitle: '아이폰 14 Pro 128GB',
        productImage: null,
        price: 950000,
        seller: '김철수',
        location: '서울시 강남구',
        date: '2025-08-25',
        status: 'completed'
      },
      {
        id: 2,
        productTitle: '북유럽 원목 식탁',
        productImage: null,
        price: 150000,
        seller: '이영희',
        location: '부산시 해운대구',
        date: '2025-08-20',
        status: 'pending'
      }
    ],
    sales: [
      {
        id: 3,
        productTitle: '다이슨 V11 무선청소기',
        productImage: null,
        price: 300000,
        buyer: '최구매',
        location: '인천시 연수구',
        date: '2025-08-15',
        status: 'completed'
      }
    ]
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTransactions(mockTransactions[activeTab] || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return '거래완료';
      case 'pending': return '진행중';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  const renderTransactionContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          불러오는 중...
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <EmptyState>
          <div className="icon">
            <FiShoppingBag />
          </div>
          <h3>
            {activeTab === 'purchases' ? '구매 내역이 없습니다' : '판매 내역이 없습니다'}
          </h3>
          <p>
            {activeTab === 'purchases' ? '관심있는 상품을 찾아보세요' : '상품을 등록해보세요'}
          </p>
        </EmptyState>
      );
    }

    return (
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id}>
            <ProductImage image={getImageUrl(transaction.productImage)} />
            
            <TransactionInfo>
              <ProductTitle>{transaction.productTitle}</ProductTitle>
              <TransactionMeta>
                <MetaItem>
                  <FiUser size={14} />
                  {activeTab === 'purchases' ? transaction.seller : transaction.buyer}
                </MetaItem>
                <MetaItem>
                  <FiMapPin size={14} />
                  {transaction.location}
                </MetaItem>
                <MetaItem>
                  <FiCalendar size={14} />
                  {formatDate(transaction.date)}
                </MetaItem>
              </TransactionMeta>
              <Price>{formatPrice(transaction.price)}</Price>
            </TransactionInfo>
            
            <StatusBadge status={transaction.status}>
              {getStatusText(transaction.status)}
            </StatusBadge>
          </TransactionCard>
        ))}
      </TransactionList>
    );
  };

  return (
    <Container>
      <Header>
        <Title>거래 내역</Title>
      </Header>

      <TabsContainer>
        <TabsHeader>
          <Tab 
            active={activeTab === 'purchases'} 
            onClick={() => setActiveTab('purchases')}
          >
            <FiShoppingBag />
            구매 내역
          </Tab>
          <Tab 
            active={activeTab === 'sales'} 
            onClick={() => setActiveTab('sales')}
          >
            <FiCreditCard />
            판매 내역
          </Tab>
        </TabsHeader>
        
        <TabContent>
          {renderTransactionContent()}
        </TabContent>
      </TabsContainer>
    </Container>
  );
};

export default TransactionPage;
