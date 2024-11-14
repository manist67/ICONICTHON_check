const express = require('express');
const router = express.Router();
const base64_decode = require("../utils/base64_decode");
const base64_decode_audio = require('../utils/base64_decode_audio');

router.post('/image', function(req, res, next) {
    const { file, studentId } = req.body;

    base64_decode(file, studentId+Date.now().toString());
    // TODO: python 모델 호출 후 flask api 호출
    res.json({})
});


router.post('/audio', function(req, res, next) {
    const { file, studentId } = req.body;

    base64_decode_audio(file, studentId+Date.now().toString());
    // TODO: python 모델 호출 후 flask api 호출
    res.json({})
});

module.exports = router;