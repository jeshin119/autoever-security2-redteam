const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// /api/download?file=경로 방식
router.get('/', (req, res) => {
  const requestedPath = req.query.file;
  if (!requestedPath) {
    return res.status(400).send('file 파라미터가 필요합니다.');
  }
  // 취약: 경로 검증 없음, 상대경로/부정 경로 그대로 사용
  const absolutePath = path.join(__dirname, '..', requestedPath);
  const fileName = path.basename(absolutePath);

  fs.stat(absolutePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return res.status(404).send('파일을 찾을 수 없습니다.');
    }

    // 헤더 설정: 실제 파일명 포함
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // 파일 스트림 생성 후 파이프
    const readStream = fs.createReadStream(absolutePath);
    readStream.pipe(res);
  });
});

module.exports = router;