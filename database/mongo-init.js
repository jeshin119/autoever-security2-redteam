// MongoDB 초기화 스크립트
// 취약한 중고거래 플랫폼 - MongoDB 설정

// 데이터베이스 생성 및 선택
db = db.getSiblingDB('vintage_market');

// 채팅 메시지 컬렉션 생성
db.createCollection('chat_messages');

// 시스템 로그 컬렉션 생성
db.createCollection('system_logs');

// 사용자 활동 로그 컬렉션 생성
db.createCollection('user_activities');

// 보안 이벤트 로그 컬렉션 생성
db.createCollection('security_events');

// 초기 채팅 데이터 삽입 (테스트용)
db.chat_messages.insertMany([
    {
        sender_id: 1,
        receiver_id: 2,
        product_id: null,
        message: "안녕하세요! 상품 문의드립니다.",
        timestamp: new Date(),
        is_read: false,
        message_type: "text"
    },
    {
        sender_id: 2,
        receiver_id: 1,
        product_id: null,
        message: "네, 무엇이 궁금하신가요?",
        timestamp: new Date(),
        is_read: true,
        message_type: "text"
    }
]);

// 시스템 로그 초기 데이터
db.system_logs.insertMany([
    {
        level: "info",
        message: "System initialized",
        timestamp: new Date(),
        service: "backend",
        user_id: null
    },
    {
        level: "warning",
        message: "Vulnerable configuration detected",
        timestamp: new Date(),
        service: "security",
        details: {
            vulnerabilities: ["weak_passwords", "sql_injection_enabled"]
        }
    }
]);

// 인덱스 생성 (성능 최적화)
db.chat_messages.createIndex({ "sender_id": 1 });
db.chat_messages.createIndex({ "receiver_id": 1 });
db.chat_messages.createIndex({ "timestamp": 1 });

db.system_logs.createIndex({ "timestamp": 1 });
db.system_logs.createIndex({ "level": 1 });
db.system_logs.createIndex({ "service": 1 });

db.user_activities.createIndex({ "user_id": 1 });
db.user_activities.createIndex({ "timestamp": 1 });

db.security_events.createIndex({ "timestamp": 1 });
db.security_events.createIndex({ "event_type": 1 });

print("MongoDB 초기화 완료 - Vintage Market Database");
print("컬렉션 목록: " + db.getCollectionNames().join(", "));