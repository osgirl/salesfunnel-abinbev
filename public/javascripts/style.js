(function ($) {
    $(function () {

        $('.button-collapse').sideNav();
        $('.parallax').parallax();

        $(document).ready(function () {
            $('.scrollspy').scrollSpy();
            $('select').material_select();
        });

        $('a.goToSignup').click(function() {
            $(document).ready(function () {
                $('ul.tabs').tabs('select_tab', 'signup');
            });
        });
        $('a.goToLogin').click(function() {
            $(document).ready(function () {
                $('ul.tabs').tabs('select_tab', 'login');
            });
        });

    }); // end of document ready
})(jQuery); // end of jQuery name space