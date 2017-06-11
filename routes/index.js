var express = require('express');
var router = express.Router();
var json2xls = require('json2xls');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('signin', { title: 'OOH' });
});
router.get('/signin/', function(req, res, next) {
	res.render('signin', { title: 'OOH' });
});

router.get('/signup/', function(req, res, next) {
	res.render('signup', { title: 'OOH' });
});

router.get('/forgot-password/', function(req, res, next) {
	res.render('forgot-password', { title: 'OOH' });
});

router.get('/add-new-jobs/', function(req, res, next) {
	res.render('add-new-jobs', { title: 'OOH' });
});

router.get('/completed-inspection/', function(req, res, next) {
	res.render('completed-inspection', { title: 'OOH' });
});

router.get('/jobs-confirmed/', function(req, res, next) {
	res.render('jobs-confirmed', { title: 'OOH' });
});

router.get('/jobs-landing/', function(req, res, next) {
	res.render('jobs-landing', { title: 'OOH' });
});

router.get('/jobs-progress/', function(req, res, next) {
	res.render('jobs-progress', { title: 'OOH' });
});	

router.get('/inspection-landing/', function(req, res, next) {
	res.render('inspection-landing', { title: 'OOH' });
});



router.get('/new-inspection/', function(req, res, next) {
	res.render('new-inspection', { title: 'OOH' });
});


router.get('/progress-inspection/', function(req, res, next) {
	res.render('progress-inspection', { title: 'OOH' });
});

router.get('/reset-password/', function(req, res, next) {
	res.render('reset-password', { title: 'OOH' });
});

router.get('/user-details/', function(req, res, next) {
	res.render('user-details', { title: 'OOH' });
});

router.get('/user-job-list/', function(req, res, next) {
	res.render('user-job-list', { title: 'OOH' });
});
router.get('/generatexls/',function(req, res) {
	// jsonArr = []
	res.xls('data.xlsx', []);
});

router.get('/maps-view/', function(req, res, next) {
	res.render('maps-view', { title: 'OOH' });
});

router.get('/completed-inspection/', function(req, res, next) {
	res.render('completed-inspection', { title: 'OOH' });
});

router.get('/user-landing/', function(req, res, next) {
	res.render('user-landing', { title: 'OOH' });
});

module.exports = router;



