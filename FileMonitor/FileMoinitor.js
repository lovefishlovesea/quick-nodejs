var fs = require('fs');
var readline = require('readline');
var filename = 'log.txt';

var logsArr = new Array();
var listenArr = new Array();

// 先处理已有的数据
function init() {
    sendHisLogs(filename, listenLogs);
}

function sendHisLogs(filename, listenLogs) {
    var rl = readline.createInterface({
        input: fs.createReadStream(filename, {
            enconding: 'utf8'
        }),
        output: null,
        terminal: false  //这个参数很重要
    });

    rl.on('line', function (line) {
        if (line) {
            logsArr.push(line.toString());
        }
    }).on('close', function () {
        for (var i = 0; i < logsArr.length; i++) {
            console.log('发送历史信号: ' + logsArr[i]);
            //generateLog(logsArr[i])
        }
        listenLogs(filename);
    });
}

function generateLog(str) {
    var regExp = /(\[.+?\])/g;//(\\[.+?\\])
    var res = str.match(regExp);
    console.log(res);
    for (i = 0; i < res.length; i++) {
        res[i] = res[i].replace('[', '').replace(']', ''); //发送历史日志
    }
}

var listenLogs = function (filePath) {
    console.log('日志监听中...');
    var fileOPFlag = "a+";
    fs.open(filePath, fileOPFlag, function (error, fd) {
        var buffer;
        fs.watchFile(filePath, {
            persistent: true,
            interval: 1000
        }, function (curr, prev) {
            // console.log(curr);
            if (curr.mtime > prev.mtime) {
                //文件内容有变化，那么通知相应的进程可以执行相关操作。例如读物文件写入数据库等
                buffer = new Buffer(curr.size - prev.size);
                fs.read(fd, buffer, 0, (curr.size - prev.size), prev.size, function (err, bytesRead, buffer) {
                    generateTxt(buffer.toString())
                });
            } else {
                console.log('文件读取错误');
            }
        });

        function generateTxt(str) { // 处理新增内容的地方
            var temp = str.split('\r\n');
            for (var s in temp) {
                console.log(temp[s]);
            }
        }
    });
}

function getNewLog(path) {
    console.log('做一些解析操作');
}

init();
