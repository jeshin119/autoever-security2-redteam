import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiArrowLeft, FiUser, FiClock, FiMessageCircle, FiHeart, FiShare2,
  FiMapPin, FiEye, FiCalendar, FiUsers
} from 'react-icons/fi';
import { getImageUrl } from '../services/api';
import { communityService } from '../services/api';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const PostContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const PostHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const PostTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const CategoryBadge = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.text};
`;

const AuthorMeta = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const PostContent = styled.div`
  padding: 2rem;
`;

const PostImages = styled.div`
  margin-bottom: 1.5rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => 
    props.count === 1 ? '1fr' :
    props.count === 2 ? '1fr 1fr' :
    props.count === 3 ? '2fr 1fr 1fr' :
    'repeat(2, 1fr)'
  };
  gap: 0.5rem;
  border-radius: 8px;
  overflow: hidden;
`;

const PostImage = styled.div`
  height: ${props => 
    props.isMain ? '300px' :
    props.count > 2 ? '148px' : '300px'
  };
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  cursor: pointer;
  
  ${props => props.count === 3 && props.index === 0 && `
    grid-row: 1 / 3;
    height: 300px;
  `}
  
  &:hover {
    opacity: 0.9;
  }
`;

const PostText = styled.div`
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  font-size: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CommentsSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 2rem;
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const CommentItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CommentTime = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommentText = styled.p`
  margin: 0;
  line-height: 1.5;
  color: ${props => props.theme.colors.text};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommunityPostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await communityService.getPost(postId);
      setPost(response.data.data);
      // Assuming comments are part of the post data or fetched separately
      // setComments(response.data.data.comments || []); 
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setPost(null); // Set post to null to display 'not found' message
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setPost(prev => ({
      ...prev,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

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
        <LoadingSpinner>게시글을 불러오는 중...</LoadingSpinner>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          게시글을 찾을 수 없습니다.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft />
        돌아가기
      </BackButton>

      <PostContainer>
        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
          <PostMeta>
            <CategoryBadge>{post.category}</CategoryBadge>
            <MetaItem>
              <FiClock size={14} />
              {formatDate(post.createdAt)}
            </MetaItem>
            <MetaItem>
              <FiEye size={14} />
              조회 {post.views}
            </MetaItem>
            <MetaItem>
              <FiHeart size={14} />
              좋아요 {post.likes}
            </MetaItem>
            <MetaItem>
              <FiMessageCircle size={14} />
              댓글 {post.comments}
            </MetaItem>
            {post.location && (
              <MetaItem>
                <FiMapPin size={14} />
                {post.location}
              </MetaItem>
            )}
          </PostMeta>
        </PostHeader>

        <AuthorSection>
          <AuthorAvatar>
            {post.author.name.charAt(0)}
          </AuthorAvatar>
          <AuthorInfo>
            <AuthorName>{post.author.name}</AuthorName>
            <AuthorMeta>
              {formatDate(post.author.joinDate)} 가입
            </AuthorMeta>
          </AuthorInfo>
        </AuthorSection>

        <PostContent>
          {post.images && post.images.length > 0 && (
            <PostImages>
              <ImageGrid count={post.images.length}>
                {post.images.map((image, index) => (
                  <PostImage
                    key={index}
                    image={getImageUrl(image)}
                    count={post.images.length}
                    index={index}
                    isMain={index === 0 && post.images.length === 1}
                  />
                ))}
              </ImageGrid>
            </PostImages>
          )}
          
          <PostText>{post.content}</PostText>
        </PostContent>

        <ActionButtons>
          <ActionButton active={isLiked} onClick={handleLike}>
            <FiHeart fill={isLiked ? 'currentColor' : 'none'} />
            좋아요 {post.likes}
          </ActionButton>
          <ActionButton onClick={handleShare}>
            <FiShare2 />
            공유하기
          </ActionButton>
        </ActionButtons>
      </PostContainer>

      <CommentsSection>
        <SectionTitle>댓글 {comments.length}개</SectionTitle>
        {comments.map(comment => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentAvatar>
                {comment.author.charAt(0)}
              </CommentAvatar>
              <CommentAuthor>{comment.author}</CommentAuthor>
              <CommentTime>{formatDate(comment.createdAt)}</CommentTime>
            </CommentHeader>
            <CommentText>{comment.content}</CommentText>
          </CommentItem>
        ))}
      </CommentsSection>
    </Container>
  );
};

export default CommunityPostDetailPage;