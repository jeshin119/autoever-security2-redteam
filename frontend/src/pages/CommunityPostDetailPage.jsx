import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiArrowLeft, FiUser, FiClock, FiMessageCircle, FiHeart, FiShare2,
  FiMapPin, FiEye, FiCalendar, FiUsers, FiSend, FiTrash2, FiFile, 
  FiDownload, FiImage, FiExternalLink
} from 'react-icons/fi';
import { getImageUrl } from '../services/api';
import { communityService, downloadService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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

const AuthorName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const PostDate = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const PostContent = styled.div`
  padding: 2rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.text};
  font-size: 1.1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
`;


const ImagePreviewSection = styled.div`
  padding: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  
  .community-image-preview {
    .single-image img {
      width: 100%;
      max-height: 500px;
      object-fit: contain;
      border-radius: 8px;
      background: #f5f5f5;
    }
    
    .multiple-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      
      .image-item img {
        width: 100%;
        height: 200px;
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
    
    .image-error {
      display: none;
    }
  }
`;

const AttachmentsSection = styled.div`
  padding: 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const AttachmentsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AttachmentsList = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const AttachmentItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const AttachmentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
`;

const AttachmentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AttachmentName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AttachmentSize = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DownloadButton = styled.div`
  padding: 0.5rem;
  border-radius: 6px;
  color: ${props => props.theme.colors.primary};
  
  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
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
`;

const CommentsSection = styled.div`
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CommentsHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const CommentsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CommentForm = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CommentInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const CommentSubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  padding: 0;
`;

const CommentItem = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CommentDate = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const CommentContent = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CommentDeleteButton = styled.button`
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.error};
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }
`;

const EmptyComments = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const CommunityPostDetailPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);


  useEffect(() => {
    console.log('CommunityPostDetailPage: useEffect triggered with id:', id);
    if (id) {
      fetchPost();
    } else {
      console.error('CommunityPostDetailPage: No id provided');
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log('Fetching post with id:', id);
      const response = await communityService.getPost(id);
      console.log('API response:', response);

      // API 응답 구조에 맞게 데이터 추출
      let postData;
      if (response.data && response.data.success && response.data.data) {
        postData = response.data.data;
      } else if (response.data) {
        postData = response.data;
      } else {
        console.error('Unexpected response format:', response);
        setPost(null);
        return;
      }
      
      console.log('Post data:', postData);
      setPost(postData);
      
      // 게시글 내용에서 URL 감지하여 미리보기 가져오기
      
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await communityService.createComment(id, { content: commentContent });

      console.log('Comment created response:', response);
      console.log('Response data structure:', response.data);

      // 백엔드 응답 구조가 단순화됨: 직접 댓글 데이터 반환
      const newComment = response.data;

      if (!newComment) {
        console.error('No comment data in response');
        return;
      }

      console.log('New comment to add:', newComment);
      console.log('Comment author:', newComment.author);
      console.log('Comment createdAt:', newComment.createdAt);

      // Add new comment to post
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
        comments_count: (prev.comments_count || 0) + 1
      }));

      setCommentContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!user) return;

    try {
      await communityService.deleteComment(commentId);

      // Remove comment from post
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId),
        comments_count: prev.comments_count - 1
      }));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const response = await communityService.togglePostLike(id);
      setPost(prev => ({
        ...prev,
        likes: response.data.likes
      }));
      setLiked(!liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];

    if (imageExts.includes(ext)) {
      return <FiImage />;
    }
    return <FiFile />;
  };

  const handleFileDownload = async (url, name) => {
    try {
      // Create full URL - remove /api from the path since uploads are served directly
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const baseUrl = API_BASE_URL.replace('/api', ''); // Remove /api if present
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      
      // Add download parameter to trigger proper download headers from server
      const downloadUrl = `${fullUrl}?download=true`;
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name;
      link.target = '_blank';
      link.setAttribute('rel', 'noopener noreferrer');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Container>
      <BackButton onClick={() => history.goBack()}>
        <FiArrowLeft />
        뒤로가기
      </BackButton>

      <PostContainer>
        <PostHeader>
          <PostTitle>{post.title}</PostTitle>
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
              <FiEye />
              조회 {post.views || 0}
            </MetaItem>
            <MetaItem>
              <FiMessageCircle />
              댓글 {post.comments_count || 0}
            </MetaItem>
          </PostMeta>
          <CategoryBadge>{post.category}</CategoryBadge>
        </PostHeader>

        <AuthorSection>
          <AuthorAvatar>
            {(post.author && post.author.name && post.author.name.charAt(0)) || 'U'}
          </AuthorAvatar>
          <AuthorInfo>
            <AuthorName>{(post.author && post.author.name) || 'Unknown User'}</AuthorName>
            <PostDate>{formatDate(post.createdAt)}</PostDate>
          </AuthorInfo>
        </AuthorSection>

        <PostContent>
          {post.content}
        </PostContent>


        {/* 이미지 미리보기 추가 */}
        {post.imagePreviewHtml && (
          <ImagePreviewSection>
            <div dangerouslySetInnerHTML={{ __html: post.imagePreviewHtml }} />
          </ImagePreviewSection>
        )}

        {post.attachments && post.attachments.length > 0 && (
          <AttachmentsSection>
            <AttachmentsTitle>
              <FiFile />
              첨부파일 ({post.attachments.length}개)
            </AttachmentsTitle>
            <AttachmentsList>
              {post.attachments.map((attachment, index) => (
                <AttachmentItem
                  key={index}
                  onClick={() => handleFileDownload(attachment.url, attachment.name)}
                >
                  <AttachmentIcon>
                    {getFileIcon(attachment.name)}
                  </AttachmentIcon>
                  <AttachmentInfo>
                    <AttachmentName title={attachment.name}>
                      {attachment.name}
                    </AttachmentName>
                    <AttachmentSize>
                      {formatFileSize(attachment.size)}
                    </AttachmentSize>
                  </AttachmentInfo>
                  <DownloadButton>
                    <FiDownload />
                  </DownloadButton>
                </AttachmentItem>
              ))}
            </AttachmentsList>
          </AttachmentsSection>
        )}

        <PostActions>
          <ActionButton onClick={handleLike}>
            <FiHeart />
            {liked ? '좋아요 취소' : '좋아요'} {post.likes || 0}
          </ActionButton>
          <ActionButton>
            <FiMessageCircle />
            댓글 {post.comments_count || 0}
          </ActionButton>
          <ActionButton>
            <FiShare2 />
            공유
          </ActionButton>
        </PostActions>
      </PostContainer>

      <CommentsSection>
        <CommentsHeader>
          <CommentsTitle>댓글 {post.comments_count || 0}개</CommentsTitle>
        </CommentsHeader>

        {user && (
          <CommentForm>
            <CommentInput
              placeholder="댓글을 작성해주세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <CommentSubmitButton
              onClick={handleCommentSubmit}
              disabled={!commentContent.trim() || submitting}
            >
              <FiSend />
              {submitting ? '작성 중...' : '댓글 작성'}
            </CommentSubmitButton>
          </CommentForm>
        )}

        <CommentList>
          {post.comments && post.comments.length > 0 ? (
            post.comments.map(comment => (
              <CommentItem key={comment.id}>
                <CommentHeader>
                  <CommentAuthor>
                    <FiUser />
                    {(comment.author && comment.author.name) || 'Unknown User'}
                  </CommentAuthor>
                  <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                </CommentHeader>

                <CommentContent>{comment.content}</CommentContent>

                <CommentActions>
                  {user && comment.user_id === user.id && (
                    <CommentDeleteButton onClick={() => handleCommentDelete(comment.id)}>
                      <FiTrash2 />
                      삭제
                    </CommentDeleteButton>
                  )}
                </CommentActions>
              </CommentItem>
            ))
          ) : (
            <EmptyComments>
              아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
            </EmptyComments>
          )}
        </CommentList>
      </CommentsSection>
    </Container>
  );
};

export default CommunityPostDetailPage;

