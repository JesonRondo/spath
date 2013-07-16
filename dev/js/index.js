var index = {
    print: function() {
        $('body').append('<p>document ready call</p>');
    }
};

$(document).ready(function() {
    index.print();
});