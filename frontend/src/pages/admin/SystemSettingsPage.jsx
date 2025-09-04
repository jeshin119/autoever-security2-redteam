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

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${props => props.theme.spacing.xl};
`;

const SettingsCard = styled.div`
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  background: white;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Switch = styled.label`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchSlider = styled.div`
  width: 50px;
  height: 24px;
  background: ${props => props.checked ? props.theme.colors.primary : '#ccc'};
  border-radius: 12px;
  position: relative;
  transition: ${props => props.theme.transitions.fast};
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.checked ? '28px' : '2px'};
    transition: ${props => props.theme.transitions.fast};
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  margin-right: ${props => props.theme.spacing.md};
  
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
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: ${props => props.theme.spacing.xs} 0 0 0;
`;

const DangerZone = styled.div`
  border: 2px solid #ef4444;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-top: ${props => props.theme.spacing.xl};
  background: rgba(239, 68, 68, 0.05);
`;

const DangerTitle = styled.h4`
  color: #ef4444;
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: 1.1rem;
`;

const SystemSettingsPage = ({ onBack }) => {
  const [settings, setSettings] = useState({
    // 사이트 설정
    siteName: 'Vintage Market',
    siteDescription: '빈티지 중고거래 플랫폼',
    siteUrl: 'https://vintage-market.com',
    contactEmail: 'admin@vintage-market.com',
    supportPhone: '02-1234-5678',
    
    // 보안 설정
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    requireTwoFactor: false,
    passwordMinLength: 8,
    enableCaptcha: true,
    
    // 알림 설정
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true,
    
    // 시스템 설정
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    backupFrequency: 'daily',
    
    // 상품 설정
    maxImagesPerProduct: 10,
    maxProductPrice: 10000000,
    requireApproval: true,
    autoApproveThreshold: 500000,
    
    // 사용자 설정
    allowRegistration: true,
    requireEmailVerification: true,
    maxProductsPerUser: 50,
    userMannerScore: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // 실제 구현에서는 API 호출
      setLoading(false);
    } catch (error) {
      console.error('Settings loading error:', error);
      toast.error('설정을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      toast.success('설정이 저장되었습니다.');
      setLoading(false);
    } catch (error) {
      console.error('Settings save error:', error);
      toast.error('설정 저장에 실패했습니다.');
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      loadSettings();
      toast.info('설정이 기본값으로 초기화되었습니다.');
    }
  };

  const handleClearCache = async () => {
    try {
      setLoading(true);
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      toast.success('캐시가 정리되었습니다.');
      setLoading(false);
    } catch (error) {
      console.error('Cache clear error:', error);
      toast.error('캐시 정리에 실패했습니다.');
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setLoading(true);
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션
      toast.success('데이터베이스 백업이 완료되었습니다.');
      setLoading(false);
    } catch (error) {
      console.error('Database backup error:', error);
      toast.error('데이터베이스 백업에 실패했습니다.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>⚙️ 시스템 설정</Title>
        <div>
          <Button className="secondary" onClick={onBack}>
            ← 대시보드로 돌아가기
          </Button>
          <Button className="secondary" onClick={handleResetSettings}>
            기본값으로 초기화
          </Button>
          <Button className="primary" onClick={handleSaveSettings} disabled={loading}>
            {loading ? '저장 중...' : '설정 저장'}
          </Button>
        </div>
      </Header>

      <SettingsGrid>
        {/* 사이트 설정 */}
        <SettingsCard>
          <CardTitle>🌐 사이트 설정</CardTitle>
          
          <FormGroup>
            <Label>사이트 이름</Label>
            <Input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>사이트 설명</Label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>사이트 URL</Label>
            <Input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>연락처 이메일</Label>
            <Input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>고객지원 전화번호</Label>
            <Input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
            />
          </FormGroup>
        </SettingsCard>

        {/* 보안 설정 */}
        <SettingsCard>
          <CardTitle>🔒 보안 설정</CardTitle>
          
          <FormGroup>
            <Label>최대 로그인 시도 횟수</Label>
            <Input
              type="number"
              min="1"
              max="10"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            />
            <InfoText>계정 잠금 전 허용되는 로그인 실패 횟수</InfoText>
          </FormGroup>
          
          <FormGroup>
            <Label>세션 타임아웃 (분)</Label>
            <Input
              type="number"
              min="5"
              max="1440"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            />
            <InfoText>사용자 비활성 후 자동 로그아웃 시간</InfoText>
          </FormGroup>
          
          <FormGroup>
            <Label>2단계 인증 필수</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
              />
              <SwitchSlider checked={settings.requireTwoFactor} />
              {settings.requireTwoFactor ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>최소 비밀번호 길이</Label>
            <Input
              type="number"
              min="6"
              max="20"
              value={settings.passwordMinLength}
              onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>캡차 사용</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.enableCaptcha}
                onChange={(e) => handleSettingChange('enableCaptcha', e.target.checked)}
              />
              <SwitchSlider checked={settings.enableCaptcha} />
              {settings.enableCaptcha ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
        </SettingsCard>

        {/* 알림 설정 */}
        <SettingsCard>
          <CardTitle>🔔 알림 설정</CardTitle>
          
          <FormGroup>
            <Label>이메일 알림</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <SwitchSlider checked={settings.emailNotifications} />
              {settings.emailNotifications ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>SMS 알림</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
              <SwitchSlider checked={settings.smsNotifications} />
              {settings.smsNotifications ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>푸시 알림</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              />
              <SwitchSlider checked={settings.pushNotifications} />
              {settings.pushNotifications ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>관리자 알림</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.adminAlerts}
                onChange={(e) => handleSettingChange('adminAlerts', e.target.checked)}
              />
              <SwitchSlider checked={settings.adminAlerts} />
              {settings.adminAlerts ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
        </SettingsCard>

        {/* 시스템 설정 */}
        <SettingsCard>
          <CardTitle>⚙️ 시스템 설정</CardTitle>
          
          <FormGroup>
            <Label>유지보수 모드</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              <SwitchSlider checked={settings.maintenanceMode} />
              {settings.maintenanceMode ? '활성화' : '비활성화'}
            </Switch>
            <InfoText>활성화 시 일반 사용자 접근 차단</InfoText>
          </FormGroup>
          
          <FormGroup>
            <Label>디버그 모드</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
              />
              <SwitchSlider checked={settings.debugMode} />
              {settings.debugMode ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>로그 레벨</Label>
            <Select
              value={settings.logLevel}
              onChange={(e) => handleSettingChange('logLevel', e.target.value)}
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>백업 빈도</Label>
            <Select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
            >
              <option value="hourly">매시간</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </Select>
          </FormGroup>
          
          <div style={{ marginTop: '1rem' }}>
            <Button className="secondary" onClick={handleClearCache}>
              캐시 정리
            </Button>
            <Button className="primary" onClick={handleBackupDatabase}>
              DB 백업
            </Button>
          </div>
        </SettingsCard>

        {/* 상품 설정 */}
        <SettingsCard>
          <CardTitle>🛍️ 상품 설정</CardTitle>
          
          <FormGroup>
            <Label>상품당 최대 이미지 수</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={settings.maxImagesPerProduct}
              onChange={(e) => handleSettingChange('maxImagesPerProduct', parseInt(e.target.value))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>최대 상품 가격</Label>
            <Input
              type="number"
              min="1000"
              max="100000000"
              value={settings.maxProductPrice}
              onChange={(e) => handleSettingChange('maxProductPrice', parseInt(e.target.value))}
            />
            <InfoText>상품 등록 시 허용되는 최대 가격</InfoText>
          </FormGroup>
          
          <FormGroup>
            <Label>상품 승인 필수</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => handleSettingChange('requireApproval', e.target.checked)}
              />
              <SwitchSlider checked={settings.requireApproval} />
              {settings.requireApproval ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>자동 승인 기준 가격</Label>
            <Input
              type="number"
              min="0"
              max="10000000"
              value={settings.autoApproveThreshold}
              onChange={(e) => handleSettingChange('autoApproveThreshold', parseInt(e.target.value))}
            />
            <InfoText>이 가격 이하 상품은 자동 승인</InfoText>
          </FormGroup>
        </SettingsCard>

        {/* 사용자 설정 */}
        <SettingsCard>
          <CardTitle>👥 사용자 설정</CardTitle>
          
          <FormGroup>
            <Label>회원가입 허용</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
              />
              <SwitchSlider checked={settings.allowRegistration} />
              {settings.allowRegistration ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>이메일 인증 필수</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
              />
              <SwitchSlider checked={settings.requireEmailVerification} />
              {settings.requireEmailVerification ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
          
          <FormGroup>
            <Label>사용자당 최대 상품 수</Label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={settings.maxProductsPerUser}
              onChange={(e) => handleSettingChange('maxProductsPerUser', parseInt(e.target.value))}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>매너점수 시스템</Label>
            <Switch>
              <SwitchInput
                type="checkbox"
                checked={settings.userMannerScore}
                onChange={(e) => handleSettingChange('userMannerScore', e.target.checked)}
              />
              <SwitchSlider checked={settings.userMannerScore} />
              {settings.userMannerScore ? '활성화' : '비활성화'}
            </Switch>
          </FormGroup>
        </SettingsCard>
      </SettingsGrid>

      {/* 위험 구역 */}
      <DangerZone>
        <DangerTitle>⚠️ 위험 구역</DangerTitle>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          이 설정들은 시스템에 큰 영향을 미칠 수 있습니다. 신중하게 변경하세요.
        </p>
        
        <Button className="danger" onClick={handleClearCache}>
          전체 캐시 삭제
        </Button>
        <Button className="danger" onClick={handleBackupDatabase}>
          전체 데이터 백업
        </Button>
      </DangerZone>
    </Container>
  );
};

export default SystemSettingsPage;
