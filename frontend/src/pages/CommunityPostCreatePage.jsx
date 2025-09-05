import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { communityService, uploadService } from '../services/api';
import { toast } from 'react-toastify';
import { FiUpload, FiX, FiFile } from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #dc3545;
    }
  `}
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  min-width: 120px;
  
  ${props => props.primary ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryDark};
    }
  ` : `
    background: white;
    color: ${props.theme.colors.text};
    border: 2px solid ${props.theme.colors.border};
    
    &:hover {
      border-color: ${props.theme.colors.primary};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FileUploadSection = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.theme.colors.background};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}10;
  }
  
  &.dragover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}20;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadText = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 1rem;
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const UploadIcon = styled(FiUpload)`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
`;

const AttachedFilesList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileName = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
`;

const FileSize = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }
`;


const CommunityPostCreatePage = () => {
  const history = useHistory();
  const isMountedRef = useRef(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '동네질문', // Default category
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const categories = ['동네질문', '분실/실종', '동네소식', '맛집/가게'];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (files) => {
    const fileList = Array.from(files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt'];
    
    const validFiles = fileList.filter(file => {
      if (file.size > maxSize) {
        toast.error(`파일 "${file.name}"이 너무 큽니다. 10MB 이하의 파일만 업로드 가능합니다.`);
        return false;
      }
      
      // 파일명에 허용된 확장자가 포함되어 있는지 확인
      const filename = file.name.toLowerCase();
      const hasAllowedExtension = allowedExtensions.some(ext => filename.includes('.' + ext));
      
      if (!hasAllowedExtension) {
        toast.error(`파일 "${file.name}"은 지원되지 않는 형식입니다.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadLoading(true);
    
    try {
      const uploadPromises = validFiles.map(async (file) => {
        console.log('Uploading file:', file.name);
        const response = await uploadService.uploadImage(file);
        console.log('Upload response:', response);
        const fileData = response.data.data || response.data; // Handle nested data structure
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          url: fileData.url || fileData.path,
          file: file
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachedFiles(prev => [...prev, ...uploadedFiles]);
      toast.success(`${uploadedFiles.length}개의 파일이 업로드되었습니다.`);
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('파일 업로드에 실패했습니다.');
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setUploadLoading(false);
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
  };

  const removeFile = (fileId) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // JSON 형태로 데이터 전송 (multipart/form-data 대신)
      const postData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        location: formData.location,
        attachments: attachedFiles.map(file => ({
          name: file.name,
          url: file.url,
          size: file.size
        })),
      };
      
      // API 호출 (JSON 전송)
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_BASE_URL}/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData)
      });
      
      if (response.ok) {
        toast.success('게시글이 성공적으로 작성되었습니다!');
        history.push('/community');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create community post:', error);
      toast.error('게시글 작성에 실패했습니다.');
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>새 게시글 작성</Title>
        <Subtitle>우리 동네에 궁금한 점이나 소식을 공유해보세요!</Subtitle>
      </Header>
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <Label htmlFor="category" required>카테고리</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </FormSection>
        <FormSection>
          <Label htmlFor="title" required>제목</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
          />
        </FormSection>
        <FormSection>
          <Label htmlFor="content" required>내용</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            required
          />
        </FormSection>
        <FormSection>
          <Label htmlFor="location" required>위치</Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="예: 강남구 역삼동"
            required
          />
        </FormSection>
        
        <FormSection>
          <Label>첨부파일 (선택사항)</Label>
          <FileUploadSection
            onClick={() => document.getElementById('fileInput').click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadIcon />
            <UploadText>
              <strong>클릭하여 파일을 선택</strong>하거나 파일을 여기로 드래그하세요
              <br />
              <small>이미지, PDF, 문서 파일 (최대 10MB)</small>
            </UploadText>
            {uploadLoading && <div>업로드 중...</div>}
          </FileUploadSection>
          
          <FileInput
            id="fileInput"
            type="file"
            multiple
            accept="*"
            onChange={handleFileInputChange}
          />
          
          {attachedFiles.length > 0 && (
            <AttachedFilesList>
              {attachedFiles.map((file) => (
                <FileItem key={file.id}>
                  <FileInfo>
                    <FiFile />
                    <div>
                      <FileName>{file.name}</FileName>
                      <FileSize>({formatFileSize(file.size)})</FileSize>
                    </div>
                  </FileInfo>
                  <RemoveButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                  >
                    <FiX />
                  </RemoveButton>
                </FileItem>
              ))}
            </AttachedFilesList>
          )}
        </FormSection>
        
        <ButtonGroup>
          <Button type="button" onClick={() => history.goBack()}>
            취소
          </Button>
          <Button type="submit" primary disabled={loading}>
            {loading ? '작성 중...' : '게시글 작성'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default CommunityPostCreatePage;