var express = require('express');
var router = express.Router();
var json2xls = require('json2xls');
var fs = require('fs');

/* GET users listing. */
router.get('/generate-xls/', function(req, res, next) {
	debugger
// 	var json = {
//     foo: 'bar',
//     qux: 'moo',
//     poo: 123,
//     stux: new Date()
// }

var xls = json2xls(req);

fs.writeFileSync('data.xlsx', xls, 'binary');
// res.xls('data.xlsx', jsonArr);
  res.send('respond with a resource');
});

router.get("/download-xls",function(req, res, next) {
	var file = 'data.xlsx';
  res.download(file);
})

module.exports = router;
