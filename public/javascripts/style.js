(function ($) {
    $(function () {

        $('.button-collapse').sideNav();
        $('.parallax').parallax();

        $(document).ready(function () {
            $('.scrollspy').scrollSpy();
            $('select').material_select();
            $('#newPassword').validate({ // initialize the plugin
                rules: {
                    newpassword: {
                        required: true,
                        minlength: 8
                    },
                    cnewpassword: {
                        required: true,
                        minlength: 8,
                        equalTo: "#newpassword"
                    }
                },
                messages: {
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#signupValidate').validate({ // initialize the plugin
                rules: {
                    uname: {
                        required: true,
                        minlength: 5
                    },
                    cemail: {
                        required: true,
                        email: true
                    },
                    newpassword: {
                        required: true,
                        minlength: 8
                    },
                    cnewpassword: {
                        required: true,
                        minlength: 8,
                        equalTo: "#newpassword"
                    },
                    crole: {
                        required: true
                    },
                    cteam: {
                        required: true
                    }
                },
                messages: {
                    uname: {
                        required: "Enter a username",
                        minlength: "Enter at least 8 characters"
                    },
                    cemail: {
                        email: "Please enter a valid email"
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#loginValidate').validate({ // initialize the plugin
                rules: {
                    username: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    username: {
                        email: "Please enter a valid email"
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                }
            });
            $('#resetPasswordValidate').validate({ // initialize the plugin
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    email: {
                        email: "Please enter a valid email"
                    }
                },
                errorElement: 'div',
                errorPlacement: function (error, element) {
                    var placement = $(element).data('error');
                    if (placement) {
                        $(placement).append(error)
                    } else {
                        error.insertAfter(element);
                    }
                }
            });

        });

        $('a.goToSignup').click(function () {
            $(document).ready(function () {
                $('ul.tabs').tabs('select_tab', 'signup');
            });
        });
        $('a.goToLogin').click(function () {
            $(document).ready(function () {
                $('ul.tabs').tabs('select_tab', 'login');
            });
        });

    }); // end of document ready
})(jQuery); // end of jQuery name space