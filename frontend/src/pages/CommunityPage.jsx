import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMapPin, FiClock, FiMessageCircle, FiHeart, FiUsers, FiCalendar } from 'react-icons/fi';
import { communityService } from '../services/api';

const Container = styled.div`
  min-height: calc(100vh - 120px);
  background: ${props => props.theme.colors.background};
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PostsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const PostCard = styled(Link)`
  display: block;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid ${props => props.theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PostCategory = styled.span`
  background: ${props => {
    switch(props.category) {
      case '동네질문': return '#e3f2fd';
      case '분실/실종': return '#fff3e0';
      case '동네소식': return '#f3e5f5';
      case '맛집/가게': return '#e8f5e8';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.category) {
      case '동네질문': return '#1976d2';
      case '분실/실종': return '#f57c00';
      case '동네소식': return '#7b1fa2';
      case '맛집/가게': return '#388e3c';
      default: return '#666';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const PostTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
`;

const PostTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const PostContent = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PostLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CreateButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  font-size: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('전체');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['전체', '동네질문', '분실/실종', '동네소식', '맛집/가게'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await communityService.getPosts();
        setPosts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch community posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeTab === '전체' 
    ? posts 
    : posts.filter(post => post.category === activeTab);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      
      if (diffHours < 1) return '방금 전';
      if (diffHours < 24) return `${diffHours}시간 전`;
      if (diffHours < 168) return `${Math.ceil(diffHours / 24)}일 전`;
      
      return date.toLocaleDateString('ko-KR');
    } catch (error) {
      return '';
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          게시글을 불러오는 중...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>동네생활</Title>
          <Subtitle>우리 동네의 다양한 소식과 정보를 공유해보세요</Subtitle>
        </HeaderContent>
      </Header>

      <MainContent>
        <CategoryTabs>
          {tabs.map(tab => (
            <Tab
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </CategoryTabs>

        <PostsGrid>
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              게시글이 없습니다.
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post.id} to={`/community/posts/${post.id}`}>
                <PostHeader>
                  <PostCategory category={post.category}>
                    {post.category}
                  </PostCategory>
                  <PostTime>
                    <FiClock size={14} />
                    {formatDate(post.createdAt)}
                  </PostTime>
                </PostHeader>
                
                <PostTitle>{post.title}</PostTitle>
                <PostContent>{post.content}</PostContent>
                
                <PostLocation>
                  <FiMapPin size={16} />
                  {post.location}
                </PostLocation>
                
                <PostFooter>
                  <AuthorInfo>
                    <FiUsers size={16} />
                    {post.author?.name || '알 수 없음'}
                  </AuthorInfo>
                  
                  <PostActions>
                    <ActionButton>
                      <FiHeart size={16} />
                      {post.likes}
                    </ActionButton>
                    <ActionButton>
                      <FiMessageCircle size={16} />
                      {post.commentsCount}
                    </ActionButton>
                  </PostActions>
                </PostFooter>
              </PostCard>
            ))
          )}
        </PostsGrid>
      </MainContent>

      <Link to="/community/new">
        <CreateButton title="글쓰기">
          +
        </CreateButton>
      </Link>
    </Container>
  );
};

export default CommunityPage;