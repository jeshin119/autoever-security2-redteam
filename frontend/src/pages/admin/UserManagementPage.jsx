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
    if (props.status === 'inactive') return '#ef4444';
    if (props.status === 'suspended') return '#f59e0b';
    return '#6b7280';
  }};
  color: white;
`;

const RoleBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.role === 'admin' ? '#8b5cf6' : '#3b82f6'};
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
  
  &.edit {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.delete {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  &.suspend {
    background: #f59e0b;
    color: white;
    
    &:hover {
      background: #d97706;
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
  max-width: 500px;
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

const UserManagementPage = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      // 실제 구현에서는 API 호출
      const mockUsers = [
        {
          id: 1,
          name: '김철수',
          email: 'kim@example.com',
          phone: '010-1111-1111',
          role: 'user',
          status: 'active',
          mannerScore: 42.5,
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20'
        },
        {
          id: 2,
          name: '이영희',
          email: 'lee@example.com',
          phone: '010-2222-2222',
          role: 'admin',
          status: 'active',
          mannerScore: 45.0,
          createdAt: '2024-01-14',
          lastLogin: '2024-01-20'
        },
        {
          id: 3,
          name: '박민수',
          email: 'park@example.com',
          phone: '010-3333-3333',
          role: 'user',
          status: 'suspended',
          mannerScore: 28.0,
          createdAt: '2024-01-13',
          lastLogin: '2024-01-18'
        },
        {
          id: 4,
          name: '최지영',
          email: 'choi@example.com',
          phone: '010-4444-4444',
          role: 'user',
          status: 'active',
          mannerScore: 38.5,
          createdAt: '2024-01-12',
          lastLogin: '2024-01-19'
        },
        {
          id: 5,
          name: '정현우',
          email: 'jung@example.com',
          phone: '010-5555-5555',
          role: 'user',
          status: 'inactive',
          mannerScore: 35.0,
          createdAt: '2024-01-11',
          lastLogin: '2024-01-15'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Users loading error:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      try {
        // 실제 구현에서는 API 호출
        setUsers(users.filter(user => user.id !== userId));
        toast.success('사용자가 삭제되었습니다.');
      } catch (error) {
        console.error('User deletion error:', error);
        toast.error('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleSuspend = async (userId) => {
    try {
      // 실제 구현에서는 API 호출
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' }
          : user
      ));
      
      const user = users.find(u => u.id === userId);
      const action = user.status === 'suspended' ? '활성화' : '정지';
      toast.success(`사용자가 ${action}되었습니다.`);
    } catch (error) {
      console.error('User suspension error:', error);
      toast.error('사용자 상태 변경에 실패했습니다.');
    }
  };

  const handleSave = async (userData) => {
    try {
      // 실제 구현에서는 API 호출
      if (editingUser) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? { ...user, ...userData } : user
        ));
        toast.success('사용자 정보가 수정되었습니다.');
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('User update error:', error);
      toast.error('사용자 정보 수정에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>👥 사용자 관리</Title>
        <Button className="secondary" onClick={onBack}>
          ← 대시보드로 돌아가기
        </Button>
      </Header>

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="이름 또는 이메일로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">모든 역할</option>
          <option value="admin">관리자</option>
          <option value="user">일반 사용자</option>
        </FilterSelect>
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">모든 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="suspended">정지</option>
        </FilterSelect>
      </SearchSection>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>전화번호</Th>
              <Th>역할</Th>
              <Th>상태</Th>
              <Th>매너점수</Th>
              <Th>가입일</Th>
              <Th>최근 로그인</Th>
              <Th>작업</Th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone}</Td>
                <Td>
                  <RoleBadge role={user.role}>
                    {user.role === 'admin' ? '관리자' : '일반사용자'}
                  </RoleBadge>
                </Td>
                <Td>
                  <StatusBadge status={user.status}>
                    {user.status === 'active' ? '활성' : 
                     user.status === 'inactive' ? '비활성' : '정지'}
                  </StatusBadge>
                </Td>
                <Td>{user.mannerScore}</Td>
                <Td>{user.createdAt}</Td>
                <Td>{user.lastLogin}</Td>
                <Td>
                  <ActionButton className="edit" onClick={() => handleEdit(user)}>
                    수정
                  </ActionButton>
                  <ActionButton 
                    className="suspend" 
                    onClick={() => handleSuspend(user.id)}
                  >
                    {user.status === 'suspended' ? '활성화' : '정지'}
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => handleDelete(user.id)}
                  >
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
              <ModalTitle>사용자 정보 수정</ModalTitle>
              <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                value={(editingUser && editingUser.name) || ''}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                value={(editingUser && editingUser.email) || ''}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>전화번호</Label>
              <Input
                type="text"
                value={(editingUser && editingUser.phone) || ''}
                onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>역할</Label>
              <Select
                value={(editingUser && editingUser.role) || 'user'}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              >
                <option value="user">일반 사용자</option>
                <option value="admin">관리자</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>상태</Label>
              <Select
                value={(editingUser && editingUser.status) || 'active'}
                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="suspended">정지</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>매너점수</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={(editingUser && editingUser.mannerScore) || 0}
                onChange={(e) => setEditingUser({...editingUser, mannerScore: parseFloat(e.target.value)})}
              />
            </FormGroup>
            
            <ButtonGroup>
              <Button className="secondary" onClick={handleCloseModal}>
                취소
              </Button>
              <Button className="primary" onClick={() => handleSave(editingUser)}>
                저장
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UserManagementPage;
