$.keydown = function(e) {
    if (!$.canEdit) {
        e.preventDefault()
    }
    if (e.keyCode === 37) {
        $.key.left = 1;
    }
    if (e.keyCode === 39) {
        $.key.right = 1;
    }
    if (e.keyCode === 32) {
        $.key.space = 1;
    } //32
    if (e.keyCode === 13) {
        $.key.enter = 1;
    }
};

$.keyup = function(e) {

    if (e.keyCode === 37) {
        $.key.left = 0;
    }
    if (e.keyCode === 39) {
        $.key.right = 0;
    }
    if (e.keyCode === 32) {
        $.key.space = 0;
    }
    if (e.keyCode === 13) {
        $.key.enter = 0;
    }
};

$.touchstart = function(e) {
    if (e.target.id === "overlay" || e.target.id === "body") {
        e.preventDefault()
    }
    // var action = e.target.dataset.action;
    //		if (action) {
    var i = 0;
    while (i < e.touches.length) {
        p = e.touches[i];
        if (p.clientX < window.innerWidth / 4) {
            $.key.left = 1;
        }
        if (p.clientX > window.innerWidth - (window.innerWidth / 2)) {
            $.key.space = 1;
        }
        if (p.clientX > window.innerWidth / 4 && p.clientX < 2 * (window.innerWidth / 4)) {
            $.key.right = 1;
        }
        i++;
    }

};

$.touchend = function(e) {
    if (e.target.id === "overlay" || e.target.id === "body") {
        e.preventDefault()
    }
    $.key.left = 0;
    $.key.right = 0;
    $.key.space = 0;
};

$.touchmove = function(e) {
    e.preventDefault();
};