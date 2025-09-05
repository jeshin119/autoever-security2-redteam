import React from 'react';
import styled from 'styled-components';
import { FiAlertCircle, FiX } from 'react-icons/fi';

var ModalOverlay = styled.div`
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
  padding: 1rem;
`;

var ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  position: relative;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

var CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #333;
  }
`;

var IconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff3cd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #856404;
  font-size: 2rem;
`;

var Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
`;

var Message = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

var Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #007bff;
  color: white;
  border: none;
  
  &:hover {
    background: #0056b3;
  }
`;

var CreditInsufficientModal = function(props) {
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var onRefresh = props.onRefresh;
  
  if (!isOpen) return null;

  var handleRefresh = function() {
    if (onRefresh) {
      onRefresh();
    }
    onClose();
  };

  return React.createElement(
    ModalOverlay,
    { onClick: onClose },
    React.createElement(
      ModalContent,
      { onClick: function(e) { e.stopPropagation(); } },
      React.createElement(
        CloseButton,
        { onClick: onClose },
        React.createElement(FiX, null)
      ),
      React.createElement(
        IconContainer,
        null,
        React.createElement(FiAlertCircle, null)
      ),
      React.createElement(
        Title,
        null,
        "크레딧이 부족합니다"
      ),
      React.createElement(
        Message,
        null,
        "구매하시려는 상품의 가격보다 보유 크레딧이 부족합니다. 크레딧을 충전한 후 다시 시도해주세요."
      ),
      React.createElement(
        Button,
        { onClick: handleRefresh },
        "확인"
      )
    )
  );
};

export default CreditInsufficientModal;