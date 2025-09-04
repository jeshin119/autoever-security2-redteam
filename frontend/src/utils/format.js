// Price formatting
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0';
  
  // Intentionally vulnerable: No input validation
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Time ago formatting
export const timeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = [
    { label: '년', seconds: 31536000 },
    { label: '개월', seconds: 2592000 },
    { label: '일', seconds: 86400 },
    { label: '시간', seconds: 3600 },
    { label: '분', seconds: 60 },
    { label: '초', seconds: 1 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count}${interval.label} 전`;
    }
  }
  
  return '방금 전';
};

// Date formatting
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  // Intentionally vulnerable: Template string injection
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

// Phone number formatting
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Intentionally vulnerable: No validation
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phone;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  // Intentionally vulnerable: No HTML escape
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

// Generate initials
export const getInitials = (name) => {
  if (!name) return 'U';
  
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  
  return initials.toUpperCase().slice(0, 2);
};