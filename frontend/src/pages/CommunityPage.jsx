import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FiMapPin, FiClock, FiMessageCircle, FiHeart, FiUsers, FiCalendar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { communityService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
  }
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
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

const PostCard = styled.div`
  display: block;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid ${props => props.theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
`;

const PostCardContent = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

const PostMainContent = styled.div`
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
`;

const PostThumbnail = styled.div`
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  
  .community-image-preview {
    width: 100%;
    height: 100%;
    
    .single-image {
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
      }
    }
    
    .multiple-images {
      position: relative;
      width: 100%;
      height: 100%;
      
      .image-item {
        width: 100%;
        height: 100%;
        
        &:not(:first-child) {
          display: none;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
      }
      
      .more-overlay {
        position: absolute;
        bottom: 2px;
        right: 2px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 0.7rem;
        font-weight: bold;
        line-height: 1;
      }
    }
    
    .image-error {
      display: none;
    }
  }
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
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
      case '취미/운동': return '#fff8e1';
      case '자유게시판': return '#f1f8e9';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.category) {
      case '동네질문': return '#1976d2';
      case '분실/실종': return '#f57c00';
      case '동네소식': return '#7b1fa2';
      case '맛집/가게': return '#388e3c';
      case '취미/운동': return '#fbc02d';
      case '자유게시판': return '#689f38';
      default: return '#757575';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const PostTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
`;

const PostContent = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
`;


const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  flex-wrap: wrap;
  overflow: hidden;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  flex-wrap: wrap;
  overflow: hidden;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
  
  &.liked {
    color: ${props => props.theme.colors.error};
  }
`;

const ImagePreview = styled.div`
  .community-image-preview {
    margin: 1rem 0;
    
    .single-image img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .multiple-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5rem;
      
      .image-item {
        position: relative;
        
        img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .more-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 8px;
        }
      }
    }
    
    .image-error {
      padding: 1rem;
      background: ${props => props.theme.colors.background};
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 8px;
      text-align: center;
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const CreatePostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const { user } = useAuth();
  const history = useHistory();

  const categories = [
    '전체',
    '동네질문',
    '분실/실종',
    '동네소식',
    '맛집/가게',
    '취미/운동',
    '자유게시판'
  ];

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching posts for category:', activeCategory);
      
      const params = {};
      if (activeCategory !== '전체') {
        params.category = activeCategory;
      }
      
      console.log('API params:', params);
      const response = await communityService.getPosts(params);
      console.log('API response:', response);
      
      // API 응답 구조에 맞게 데이터 추출
      let postsData = [];
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        postsData = response.data.data;
        console.log('Posts set:', response.data.data);
      } else if (response.data && Array.isArray(response.data)) {
        postsData = response.data;
        console.log('Posts set (direct):', response.data);
      } else {
        console.warn('Unexpected response format:', response);
        postsData = [];
      }
      
      setPosts(postsData);
      
      // 좋아요 상태 설정 (서버에서 isLiked 정보가 포함되어 있다고 가정)
      const liked = new Set();
      postsData.forEach(post => {
        if (post.isLiked) {
          liked.add(post.id);
        }
      });
      setLikedPosts(liked);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostLike = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      history.push('/login');
      return;
    }

    try {
      // API 호출
      const response = await communityService.togglePostLike(postId);
      
      // 서버 응답에 따라 상태 업데이트
      if (response.data) {
        // 좋아요 수 업데이트
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likes: response.data.likes }
            : post
        ));
        
        // 좋아요 상태 업데이트
        const newLikedPosts = new Set(likedPosts);
        if (response.data.isLiked) {
          newLikedPosts.add(postId);
        } else {
          newLikedPosts.delete(postId);
        }
        setLikedPosts(newLikedPosts);
      }
      
    } catch (error) {
      console.error('Failed to toggle post like:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return '방금 전';
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffHours < 168) return `${Math.ceil(diffHours / 24)}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  // URL 감지 함수
  const detectUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };


  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Title>동네생활</Title>
            <Subtitle>우리 동네 이야기를 나누어보세요</Subtitle>
          </HeaderContent>
        </Header>
        <MainContent>
          <div>Loading...</div>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>동네생활</Title>
          <Subtitle>우리 동네 이야기를 나누어보세요</Subtitle>
        </HeaderContent>
      </Header>
      
      <MainContent>
        <CreatePostButton to="/community/new">
          <FiUsers />
          글쓰기
        </CreatePostButton>

        <CategoryTabs>
          {categories.map(category => (
            <Tab
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Tab>
          ))}
        </CategoryTabs>

        <PostsGrid>
          {posts.length > 0 ? (
            posts.filter(post => post && post.id).map(post => (
              <PostCard key={post.id}>
                <PostLink to={`/community/${post.id}`}>
                  <PostCardContent>
                    <PostMainContent>
                      <PostHeader>
                        <PostCategory category={post.category}>
                          {post.category}
                        </PostCategory>
                      </PostHeader>
                      
                      <PostTitle>{post.title}</PostTitle>
                      
                      <PostContent>{post.content}</PostContent>
                      
                      <PostMeta>
                        <MetaItem>
                          <FiMapPin />
                          {post.location}
                        </MetaItem>
                        <MetaItem>
                          <FiClock />
                          {formatDate(post.createdAt)}
                        </MetaItem>
                        <MetaItem>
                          <FiMessageCircle />
                          댓글 {post.comments_count || 0}
                        </MetaItem>
                      </PostMeta>
                    </PostMainContent>
                    
                    {/* 오른쪽 썸네일 이미지 */}
                    {post.imagePreviewHtml && (
                      <PostThumbnail>
                        <div dangerouslySetInnerHTML={{ __html: post.imagePreviewHtml }} />
                      </PostThumbnail>
                    )}
                  </PostCardContent>
                </PostLink>
                
                <PostActions>
                  <ActionButton 
                    onClick={(e) => handlePostLike(post.id, e)}
                    className={likedPosts.has(post.id) ? 'liked' : ''}
                  >
                    {likedPosts.has(post.id) ? <FaHeart /> : <FiHeart />}
                    좋아요 {post.likes || 0}
                  </ActionButton>
                </PostActions>
              </PostCard>
            ))
          ) : (
            <EmptyState>
              {activeCategory === '전체' 
                ? '아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!'
                : `${activeCategory} 카테고리에 게시글이 없습니다.`
              }
            </EmptyState>
          )}
        </PostsGrid>
      </MainContent>
    </Container>
  );
};

export default CommunityPage;