/**
 * Created by everardosifuentes on 7/10/17.
 */
//x-editable

$(document).ready(function () {
    $.fn.editable.defaults.mode = 'popup';
    var $username = $('#username');
    var paramToken = $username.data('param');
    var token = $username.data('token');
    $username.editable({
        url: '/user/edit/profile?' + paramToken + '=' + token
    });
});


$(document).ready(function () {
    $.fn.editable.defaults.mode = 'popup';
    var $username = $('#email');
    var paramToken = $username.data('param');
    var token = $username.data('token');
    $('#email').editable({
        url: '/user/edit/profile?' + paramToken + '=' + token
    });
});

// $.extend($.fn.editable.defaults, {
//     ajaxOptions: {
//         type: 'PUT',
//         dataType: 'script'
//     }
// });



