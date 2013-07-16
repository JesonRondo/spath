var index = {
    print: function() {
        var flag = true;
        if (flag) {
            $('body').append('<p>document ready call ' + flag + '</p>');
        } else {
            $('body').append('<p>document ready call ' + flag + '</p>');
        }
    }
};

$(document).ready(function() {
    index.print();
});