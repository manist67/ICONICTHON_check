const express = require('express');
const router = express.Router();
const base64_decode = require("../utils/base64_decode");
const base64_decode_audio = require('../utils/base64_decode_audio');
const { addImages } = require("./cron");
const axios = require("axios")

router.post('/image', function(req, res, next) {
    const { file, studentId } = req.body;

    const filename = base64_decode(file, studentId+"_"+Date.now().toString());
    // TODO: python 모델 호출 후 flask api 호출

    addImages({ filename, studentId });
    res.json({})
});


router.post('/audio', function(req, res, next) {
    const { file, studentId } = req.body;

    const filepath = base64_decode_audio(file, studentId+"_"+Date.now().toString());
    // TODO: python 모델 호출 후 flask api 호출
        
    const { spawn } = require('child_process');
    function runVoicePredict(id) {
        const pypred = spawn('python', [
            './voice_analyzer/voice_analyzer.py',
            id,
            filepath
        ]);


        const regex = /__(true|false)__/g
        pypred.stdout.on('data', function(data) {
            const str = data.toString().trim();
            console.log(str)
            if(!regex.test(str)) return;

            axios.post("/attendance", {
                student: id,
                time: Date.now(),
                attitude: str == '__true__' ? "ATTEND" : "FAKE"
            });
        });
    }
    runVoicePredict(studentId);
    res.json({})
});

module.exports = router;