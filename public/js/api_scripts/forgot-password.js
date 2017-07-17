$('#forgot-password-form').validate({
	rules: {
		email:{
			required:true,
			email:true,
		}
	},

	messages: {
		email:{
			required:"Please Enter email id",
			email:"Incorrect Email id",
		},
	},


	submitHandler: function(form) {
		var post_data = {
			email:$(form).find("#email-field").val(),
			 usertype:'ADMIN',


		}
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('userforgotpwd',post_data,function(res){
			console.log(res)
			if(res[0].status == "success"){
				$("#forgot-password-form .error-display").text(res[0].message)
			}else{
				$("#forgot-password-form .error-display").text(res[0].message)
				setTimeout(function(){
					$("#forgot-password-form .error-display").text("")
				},4000)
			}
		});
	}
});
$('#forgot-password-form').submit(function(e){
	e.preventDefault();
})