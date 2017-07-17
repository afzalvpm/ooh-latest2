$('#resend-form').validate({
	rules: {
		email:{
			required:true,
			email:true
		}
	},

	messages: {
		email: "Please Enter Email Id",
	},

	submitHandler: function(form) {
		var post_data = {email:$(form).find("#email-field").val(),
		usertype:'ADMIN'
	}
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
	kumulos_init.call('resendemailforverification',post_data,function(res){
		if(res[0].status == "success"){
			localStorage['ooh-jwt-token'] = res[0].token
			$("#signin-form .error-display").text("Successfully logged in")
			setTimeout(function(){
				window.location= "/"
			},1000)
		}else{
			$("#signin-form .error-display").text(res[0].status)
			setTimeout(function(){
				$("#signin-form .error-display").text("")
			},4000)
		}
	});
}
});
$('#resend-form').submit(function(e){
	e.preventDefault();
})