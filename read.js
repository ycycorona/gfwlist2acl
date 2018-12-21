const readline = require('readline');
const path = require('path');
const fs = require('fs');
let filepath = path.join(__dirname, "raw-gfwlist.txt")
//let filepath = path.join(__dirname, "test.txt")
let input = fs.createReadStream(filepath)
const rl = readline.createInterface({
    input: input
});
let count = 0
let resArray = []
let stop = false

const twoStick_R = /^\|\|(.*)$/
const oneStick_R = /^\|(.*)$/
const comment_R = /^[![](.*)$/
const point_R = /^\.(.*)$/
const wordBegin_R = /^\w(.*)$/

const regList = [
    wordBegin_R, twoStick_R, point_R, oneStick_R
]

function convertFun(line, resArray) {
    if(stop) {
        return
    }
    let convertRes = null
    let breakCount = 0
    for(let i=0; i<regList.length; i++) {
        convertRes = line.match(regList[i])
        if(convertRes) {
            breakCount = i
            break;
        }
    }
    if (convertRes) {
        if (breakCount === 0) {
            const http = convertRes[0].match(/^http:\/\/(.*)/)
            const https = convertRes[0].match(/^https:\/\/(.*)/)
            if (http) {
                resArray.push(http[1])
            } else if (https) {
                resArray.push(https[1])
            } else {
                resArray.push(convertRes[0])
            }
        } else {
            const http = convertRes[1].match(/^http:\/\/(.*)/)
            const https = convertRes[1].match(/^https:\/\/(.*)/)
            if (http) {
                resArray.push(http[1])
            } else if (https) {
                resArray.push(https[1])
            } else {
                resArray.push(convertRes[1])
            } 
        }
    }

}

const handleLineFun = (line) => {
    count++
    if (line === '!##############General List End#################') {
        rl.close()
        stop = true
    }
    convertFun(line, resArray)
}

rl.on('line', handleLineFun);

rl.on('close', () => {
    console.log(resArray.length)
    resArray = Array.from(new Set(resArray)) // 去重
    console.log(resArray.length)

    fs.writeFile('./gfwlist-acl.txt', resArray.join('\n'), function(err){ 
        if(err){
            console.log(err);
        } else {
            console.log('写入成功');
        }
    })
});

