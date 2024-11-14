const cron = require('node-cron');
const axios = require('axios');

const queue = {};
const task = cron.schedule("* * * * * *", () => {
    const itemKeys = Object.keys(queue).filter(key=>{
        return queue[key].length > 5;
    });

    for( let key of itemKeys ) {
        runImagesPredict(key, queue[key])
        queue[key] = [];
    }
})

function addImages(imageObj) {
    if(!queue[imageObj.studentId]) queue[imageObj.studentId] = [];
    queue[imageObj.studentId].push(imageObj);
}

const { spawn } = require('child_process');
function runImagesPredict(id, images) {
    const pypred = spawn('python', [
        './image_analyzer/imageManyMany.py',
        id,
        ...images
    ]);

    pypred.stdout.on('data', function(data) {
        let res;
        switch(data.toString().split(":")[1]) {
            case "focus": res = 1; break;
            case "sleep": res = 0; break;
            case "no_data": res = -1; break;
            default: res = -1; break;
        }

        axios.post("/attitude", {
            student: id,
            time: Date.now().getTime(),
            attitude: res
        });
    });
}

module.exports = {
    addImages, task
}