const path = require('path')
const fs = require('fs')
const gfwlistPac = require('./gfwlistPac')
const myList = require('./mylist')

const list = myList.concat(gfwlistPac)

list.sort()

// console.log(list)
fs.writeFile(path.join(__dirname, './gfwlist.acl.txt'), list.join('\n'), function(err){
    if(err){
        console.log(err);
    } else {
        console.log(`*****写入${list.length}条*****`);
        console.log('*****写入成功*****');
    }
})
