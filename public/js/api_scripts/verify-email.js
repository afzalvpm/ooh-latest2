function verify_mail(type,offset){
	var url_string = new URL(window.location.href);
	var url = new URL(url_string);
	var email = url.searchParams.get("email");
	var code = url.searchParams.get("Code");
	var post_data = {
		code:code,
		email:email,
		usertype:'ADMIN'
	}
		var kumulos_init= Kumulos.initWithAPIKeyAndSecretKey('05a0cda2-401b-4a58-9336-69cc54452eba', 'EKGTFyZG5/RQe7QuRridgjc0K8TIaKX3wLxC');
		kumulos_init.call('useremailverification',post_data,function(res){
				console.log(res)
				if(res[0].status == "success"){
					$("#email-verification-success").removeClass("hide");
					$("#email-verification-error").addClass("hide")
				}else{
					$("#email-verification-error").removeClass("hide")
					$("#email-verification-success").addClass("hide");

				}
			})
}


$(function(){
        verify_mail()
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