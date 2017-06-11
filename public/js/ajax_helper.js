 var base_url = window.location.protocol + '//' + window.location.hostname;
var ajaxFactory = {

    ajaxHandler: function (url, method, data, callback) {

        var ajax_data = {
            'url': url,
            'type': method,
            'contentType': 'application/json',
            'success': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response)

                }
            },
            'error': function (response) {

                if (typeof callback != 'undefined' && response) {
                    console.log(response.responseJSON)
                    callback(response.responseJSON)
                }

            }
        };

        if (data != undefined) {
            ajax_data['data'] = JSON.stringify(data)
        }

        var csrf_token = ajaxFactory.getCookie('csrftoken');
        if (csrf_token != '') {
            ajax_data['beforeSend'] = function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }

        $.ajax(ajax_data)
    },
    ajaxHandlerFile: function (url, method, data, callback, progress_obj) {
        var ajax_data = {
            'url': url,
            'type': method,
            'data': data,
            'contentType': false,
            'processData': false,
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();

                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function (evt) {
                        var percent = (evt.loaded / evt.total) * 100;
                        if(progress_obj){
                            var progress_bar = progress_obj.progress_bar_selector;
                            var progress_width = $(progress_bar).find('.progress-back').width()/progress_obj.file_length;
                            var progress_percent = progress_width*.5;
                            var new_width = $(progress_bar).find('.progress-in').width()+progress_percent;
                            if(new_width < $(progress_bar).find('.progress-back').width()) {
                                $(progress_bar).find('.progress-in').width(new_width);
                            }
                            if($(progress_bar).find('label.uploaded_text label:nth-child(1)').text() < Math.ceil($(progress_bar).find('.progress-in').width()/progress_width)) {
                                $(progress_bar).find('label.uploaded_text label:nth-child(1)').text(Math.ceil($(progress_bar).find('.progress-in').width() / progress_width));
                            }
                        }
                    }, false);
                    xhr.upload.addEventListener('load', function (evt) {

                    });
                }
                return xhr;
            },
            'success': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response)

                }
            },
            'error': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response.responseJSON)

                }
            }
        };

        var csrf_token = ajaxFactory.getCookie('csrftoken');
        if (csrf_token != '') {
            ajax_data['beforeSend'] = function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }

        $.ajax(ajax_data)
    },
    ajaxHandlerJWTImage: function (url, method, data, token, callback) {

        var csrf_token = ajaxFactory.getCookie('csrftoken');

        $.ajax({
            'url': url,
            'type': method,
            'data': data,
            'contentType': false,
            'processData': false,
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
                xhr.setRequestHeader("Authorization", "JWT " + token);
            },
            'success': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response)
                }

            },
            error: function (response, status, error) {
                if (response.status == 401) {
                    ajaxFactory.secureHTTPRequestHandlerImage(url, method, data, callback, 'expired');
                }
            }
        })
    },

    ajaxHandlerJWT: function (url, method, data, token, callback) {

        var csrf_token = ajaxFactory.getCookie('csrftoken');

        $.ajax({
            'url': url,
            'type': method,
            'data': JSON.stringify(data),
            'contentType': 'application/json',
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
                xhr.setRequestHeader("Authorization", "JWT " + token);
            },
            'success': function (response, status, xhr) {
                console.log(xhr);
                callback(response)
            },
            error: function (response, status, error) {
                ajaxFactory.secureHTTPRequestHandler(url, method, data, callback, 'expired')
            }


        })
    },

    getCookie: function (name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    secureHTTPRequestHandler: function (url, method, data, callback, type) {
        var token = localStorage.getItem('jwt_token');

        if (token == '' || type == 'expired') {
            ajaxFactory.ajaxHandler(base_url + '/api-token-auth/', 'GET', {}, function (response) {
                localStorage.setItem('token', response.token);
                ajaxFactory.ajaxHandlerJWT(url, method, data, response.token, callback)
            })
        }
        else {
            ajaxFactory.ajaxHandlerJWT(url, method, data, token, callback)
        }
    },

    secureHTTPRequestHandlerImage: function (url, method, data, callback, type) {
        var token = localStorage.getItem('jwt_token');
        if (token == '' || type == 'expired') {
            ajaxFactory.ajaxHandler(base_url + '/api-token-auth/', 'GET', {}, function (response) {
                localStorage.setItem('token', response.token);
                ajaxFactory.ajaxHandlerJWTImage(url, method, data, response.token, callback)
            })
        }
        else {
            ajaxFactory.ajaxHandlerJWTImage(url, method, data, token, callback)
        }
    }
    , RequestFormdata: function (url, method, data, callback) {
        var ajax_data = {
            'url': url,
            'type': method,
            'contentType': 'application/x-www-form-urlencoded',
            'success': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response)
                }
            },
            'error': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response)
                }
            }
        };

        if (data != undefined) {
            ajax_data['data'] = data
        }

        var csrf_token = ajaxFactory.getCookie('csrftoken');
        if (csrf_token != '') {
            ajax_data['beforeSend'] = function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }

        $.ajax(ajax_data)
    }
};
var themeHelper = {

    ajaxHandler: function (url, method, data, callback) {

        var ajax_data = {
            'url': url,
            'type': method,
            'contentType': 'application/json',
            'success': function (response) {
                if (typeof callback != 'undefined' && response) {
                    callback(response)
                }
            },
            'error': function (response) {
                callback(response)

            }
        };
        if (data != undefined) {
            ajax_data['data'] = JSON.stringify(data)
        }

        var csrf_token = ajaxFactory.getCookie('csrftoken');
        if (csrf_token != '') {
            ajax_data['beforeSend'] = function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrf_token);
            }
        }
        $.ajax(ajax_data)
    },

}
