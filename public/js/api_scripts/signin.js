

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
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('77d8a0b0-b7a1-4e8f-ad51-61f413feb685', 'rqgJTOIfusC6IqQFNAaAinX2VvEyZP0V1E4d');
	kumulos_init.call('usersigninverification',post_data,function(res){
		console.log(res)
		if(res[0].status == "success"){
			localStorage['ooh-jwt-token'] = res[0].token
			$("#signin-form .error-display").text("Successfully logged in")
			setTimeout(function(){
				// window.location= "/new-inspection"
			},1000)
		}else if(res[0].status == "Notverified"){
			$(".resend-verification").removeClass("hide");
		}
		else{
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
});


$(".resend-verification").on("click",function(e){
	e.preventDefault();
	var that = this
	var post_data = {email:$("#email-field").val(),
		usertype:'ADMIN'
	}
	var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('77d8a0b0-b7a1-4e8f-ad51-61f413feb685', 'rqgJTOIfusC6IqQFNAaAinX2VvEyZP0V1E4d');
	kumulos_init.call('resendemailforverification',post_data,function(res){
		console.log(res)
		if(res[0].status == "success"){
			$(that).text("We have sent you a mail on your registered email id. Kindly verify it by clicking on the link provided in email!")
			setTimeout(function(){
				$(that).text("resend verification code")
			},2000)
		}else{
			$(that).text("Internal Error")
			setTimeout(function(){
				$(that).text("resend verification code")
			},4000)
		}
	});
})