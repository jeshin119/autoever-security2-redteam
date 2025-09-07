FROM mysql:8.0

# init.sql 파일을 컨테이너에 복사
COPY database/init.sql /docker-entrypoint-initdb.d/init.sql

# MySQL 설정
CMD ["--default-authentication-plugin=mysql_native_password", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]
