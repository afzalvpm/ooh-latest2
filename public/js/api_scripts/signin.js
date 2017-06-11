

$('#signin-form').validate({
	rules: {
		email:{
			required:true,
			email:true
		},
		password:{
			required:true,
			minlength: 6,
			maxlength: 16
		},
	},

	messages: {
		email: "Please Enter Email Id",
		password: "Please Enter Password",
	},

	submitHandler: function(form) {
		var post_data = {email:$(form).find("#email-field").val(),
		password:$(form).find("#password-field").val(),
		usertype:'ADMIN'
	}
	console.log(post_data)
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');

	kumulos_init.call('usersigninverification',post_data,function(res){
		console.log(res)
		if(res[0].status == "success"){
			localStorage['ooh-jwt-token'] = res[0].token
			$("#signin-form .error-display").text("Successfully logged in")
			setTimeout(function(){
				window.location= "/new-inspection"
			},1000)
		}else{
			debugger
			$("#signin-form .error-display").text(res[0].status)
			setTimeout(function(){
				$("#signin-form .error-display").text("")
			},4000)
		}
	});
}
});
$('#signin-form').submit(function(e){
	e.preventDefault();
})