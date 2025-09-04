import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${props => props.theme.spacing.sm};
  }
`;

const CategoryCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: ${props => props.theme.transitions.fast};
  text-align: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
    background: ${props => props.theme.colors.background};
  }
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 1.5rem;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const CategoryName = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
`;

const categories = [
  { id: 'electronics', name: '디지털기기', icon: '💻', path: '/products?category=디지털/가전' },
  { id: 'home', name: '생활가전', icon: '🏠', path: '/products?category=생활가전' },
  { id: 'furniture', name: '가구/인테리어', icon: '🪑', path: '/products?category=가구/인테리어' },
  { id: 'baby', name: '유아동', icon: '👶', path: '/products?category=유아동' },
  { id: 'fashion', name: '여성의류', icon: '👗', path: '/products?category=패션/의류' },
  { id: 'mens', name: '남성패션/잡화', icon: '👔', path: '/products?category=남성패션/잡화' },
  { id: 'beauty', name: '뷰티/미용', icon: '💄', path: '/products?category=뷰티/미용' },
  { id: 'sports', name: '스포츠/레저', icon: '⚽', path: '/products?category=스포츠/레저' },
  { id: 'hobby', name: '취미/게임/음반', icon: '🎮', path: '/products?category=도서/음반' },
  { id: 'books', name: '도서', icon: '📚', path: '/products?category=도서/음반' },
  { id: 'tickets', name: '티켓/교환권', icon: '🎫', path: '/products?category=티켓/교환권' },
  { id: 'food', name: '식품', icon: '🍔', path: '/products?category=식품' },
  { id: 'pets', name: '반려동물용품', icon: '🐕', path: '/products?category=반려동물용품' },
  { id: 'plants', name: '식물', icon: '🌱', path: '/products?category=식물' },
  { id: 'other', name: '기타', icon: '📦', path: '/products?category=기타' },
];

const CategoryGrid = () => {
  return (
    <Grid>
      {categories.map(category => (
        <CategoryCard 
          key={category.id} 
          to={category.path}
          // Intentionally vulnerable: Direct path usage
        >
          <CategoryIcon>{category.icon}</CategoryIcon>
          <CategoryName>{category.name}</CategoryName>
        </CategoryCard>
      ))}
    </Grid>
  );
};

export default CategoryGrid;