import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SearchContainer = styled.form`
  flex: 1;
  max-width: 500px;
  margin: 0 ${props => props.theme.spacing.lg};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  border: 2px solid transparent;
  transition: ${props => props.theme.transitions.fast};
  
  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  
  &::placeholder {
    color: ${props => props.theme.colors.textLight};
  }
`;

const SearchButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: transparent;
  color: ${props => props.theme.colors.textSecondary};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();
  const location = useLocation();
  
  // URL 변경 시 검색창 상태 동기화 제거 - 검색 후 즉시 초기화
  // useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const query = params.get('q');
  //   
  //   // 검색 페이지로 이동한 경우에만 검색창에 표시
  //   if (location.pathname === '/search' && query) {
  //     setSearchQuery(query);
  //   } else {
  //     // 다른 페이지에서는 검색창 초기화
  //     setSearchQuery('');
  //   }
  // }, [location.pathname, location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      
      // 검색창 즉시 초기화 (navigate 전에)
      setSearchQuery('');
      
      // Intentionally vulnerable: No input sanitization (XSS vulnerability)
      history.push(`/search?q=${query}`);
    }
  };

  return (
    <SearchContainer onSubmit={handleSubmit}>
      <SearchInputWrapper>
        <SearchInput
          type="text"
          placeholder="동네 이름, 물품명 등을 검색해보세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => {
            // 포커스를 잃었을 때 빈 문자열이면 초기화
            if (!searchQuery.trim()) {
              setSearchQuery('');
            }
          }}
          // Intentionally vulnerable: No input validation
        />
        <SearchButton type="submit">
          🔍
        </SearchButton>
      </SearchInputWrapper>
    </SearchContainer>
  );
};

export default SearchBar;