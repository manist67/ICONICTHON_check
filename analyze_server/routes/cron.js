const cron = require('node-cron');
const axios = require('axios');

let stack = [];
const queue = {};
const task = cron.schedule("* * * * * *", () => {
    const itemKeys = Object.keys(queue).filter(key=>{
        return queue[key].length > 5;
    });

    for( let key of itemKeys ) {
        runImagesPredict(key, queue[key])
        queue[key] = [];
    }

    const noFaceCounts = {};
    stack.forEach(function (x) { noFaceCounts[x] = (noFaceCounts[x] || 0) + 1; });
    
    const badGuys = Object.keys(noFaceCounts).filter(e=>noFaceCounts[e] > 4);
    for(let guy of badGuys) {
        axios.post("/attendance", {
            student: guy,
            time: Date.now(),
            attendanceStatus: "LEAVE"
        });
        stack = stack.filter(e=>e!=guy);
    }
})

function addImages(imageObj) {
    if(!queue[imageObj.studentId]) queue[imageObj.studentId] = [];
    queue[imageObj.studentId].push(imageObj);
}

const { spawn } = require('child_process');
function runImagesPredict(id, images) {
    const pypred = spawn('python3', [
        './image_analyzer/imageManyMany.py',
        id,
        ...images.map(e=>e.filename)
    ]);


    pypred.stdout.on('data', function(data) {
        let res;
        console.log(data.toString())
        switch(data.toString().split(":")[1].trim()) {
            case "focus": res = 1; break;
            case "sleep": res = 0; break;
            case "no_data": default: 
                stack.push(id);
                return;
        }

        axios.post("/attitude", {
            student: id,
            time: Date.now(),
            attitude: res
        });
    });
}

module.exports = {
    addImages, task
}