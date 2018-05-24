var tween = (function() {

    function tweenTo(_object, _element, _duration, _repeat) {
        var count = 0;
        var ele = {};
        var org = {};
        var diff = _element.x - _object.x;
        for (ob in _element) {
            ele[ob] = (_element[ob] - _object[ob]) / _duration;
            org[ob] = (_element[ob] - _object[ob]);
        }

        requestAnimationFrame(tween);

        function tween() {
            var cont = false;
            for (ob in ele) {
                var test = (ele[ob] > 0 && _object[ob] < _element[ob]);
                if ((ele[ob] > 0 && _object[ob] < _element[ob]) || (ele[ob] < 0 && _object[ob] > _element[ob])) {
                    _object[ob] += ele[ob];
                    cont = true;
                }

            }
            if (!cont && _repeat > count) {
                for (ob in ele) {
                    org[ob] *= -1;
                    _element[ob] += org[ob];
                    ele[ob] *= -1;
                }
                cont = true;
                count++;
            }

            if (cont) {
                requestAnimationFrame(tween);
            }

        }
    }

    return {
        to: function(_object, _element, _duration, _repeat) {
            tweenTo(_object, _element, _duration, _repeat);
        }
    };
})();

$.blocks = {
    0: {
        id: 0,
        name: "bounce"
    },
    1: {
        id: 1,
        name: "stick"
    },
    2: {
        id: 2,
        name: "ice"
    },
    3: {
        id: 3,
        name: "sliderBounce"
    },
    4: {
        id: 4,
        name: "finish"
    },
    8: {
        id: 8,
        name: "stopper"
    },
    9: {
        id: 9,
        name: "theWall"
    },
    10: {
        id: 10,
        name: "left wall stick"
    },
    11: {
        id: 11,
        name: "right wall stick"
    },
    12: {
        id: 12,
        name: "left bounce"
    },
    13: {
        id: 13,
        name: "right bounce"
    }
};

$.block = function(opt) {
    for (var e in $.blockBehaviors[$.blocks[opt.t].id]) {
        this[e] = $.blockBehaviors[$.blocks[opt.t].id][e];
    }
    for (var e in opt) { //level defs will over right defaults in block behaviors
        this[e] = opt[e];
    }

    this.add = this.add || function() {};
    this.style = this.style || "cube";
    this.init = this.init || function() {};
    this.x = this.x || 100;
    this.y = this.y || 100;

    this.w = this.w || 160;
    this.h = this.h || 40;

    var htmlOBJ = document.createElement('div');
    var container = document.getElementById('blockContainer');

    var status = true;
    htmlOBJ.className = this.style;

    this.init();
    htmlOBJ.style.width = this.w + 'px';
    htmlOBJ.style.height = this.h + 'px';
    if (opt.t === 4) {
        htmlOBJ.innerHTML = "<div class='func lFunc'>{</div><div class='func rFunc'>}</div>";
    }
    container.appendChild(htmlOBJ);


    this.transition = function() {
        htmlOBJ.style.transition = "all 0s";
    };

    this.kill = function() {
        container.removeChild(htmlOBJ);
    };

    this.render = function() {

        htmlOBJ.style.transform = "translate(" + ($.offset.x + this.x) + "px," + ($.offset.y + this.y) + "px)";
    }
};

$.blockBehaviors = [{
    style: "base tramp",

    ontouch: function() {

        if ($.myplayer.velocityY <= 0) {
            $.myplayer.velocityY = 30;
            $.myplayer.addAnim('bounce');
            $.playSound($.sounds['bounce1']);
        }
        else {
            $.myplayer.velocityY = $.myplayer.gravity;
        }
    }
},
    {
    w: 800,
    h: 200,
    ontouch: function() {
        if ($.key.right || $.key.left) {
            $.myplayer.velocityY = .5;
            $.myplayer.velocityX *= 1.02;
            $.myplayer.addAnim('grab');
        }
    }
},
    {
    style: "base ice",
    ontouch: function() {
        if ($.myplayer.velocityY !== 0) {
            $.playSound($.sounds['bounce3']);
            $.myplayer.addAnim('flatten');

        }
        if ($.myplayer.velocityY <= 0 && $.myplayer.y + ($.myplayer.h / 2) < this.y) {

            $.myplayer.velocityX *= .99;
            $.myplayer.velocityY = $.myplayer.weight;
            $.myplayer.y = this.y - $.myplayer.h;
        }
        else {
            $.myplayer.velocityY = -10;
        }
    }
},
    {
    style: "base tramp",
    init: function() {
        tween.to(this, {
            x: this.x + 100
        }, 90, 1000);
    },
    ontouch: function() {
        if ($.myplayer.velocityY <= 0) {
            $.myplayer.velocityY = 30;
            $.playSound($.sounds['bounce1']);
            $.myplayer.addAnim('bounce');
        }
    }
},
    {
    style: "cube finish",
    w: 200,
    h: 50,
    ontouch: function() {
        if ($.myplayer.weight > 0) {
            $.myplayer.success();
            $.playSound($.sounds['bounce']);
            $.playSound($.sounds['bounce1']);
            $.playSound($.sounds['bounce2']);
            $.playSound($.sounds['bounce3']);
            $.key.space = 0;
            $.myplayer.velocityY = 0;
            $.myplayer.velocityX = 0;
            $.myplayer.weight = 0;
        }
    }
}, {}, {}, {},
    {
    style: "base floor",
    ontouch: function() {
        if ($.myplayer.velocityY !== 0) {
            $.myplayer.addAnim('flatten');
            $.playSound($.sounds['bounce2']);

        }
        if ($.myplayer.velocityY <= 0 && $.myplayer.y + ($.myplayer.h / 2) < this.y) {

            $.myplayer.velocityX *= .9;

            $.myplayer.velocityY = $.myplayer.weight;
            $.myplayer.y = this.y - $.myplayer.h;
        } else {
            $.myplayer.velocityY = -10;
        }
    }
},
    {
    style: "base wall",
    add: function() {
        $.myplayer.velocityY = 0;
    },
    w: 100,
    h: 2100,
    ontouch: function() {
        if ($.myplayer.x < this.x) {
            $.myplayer.velocityX = -1;
        }
        else {
            $.myplayer.velocityX = 1;
        }
        $.playSound($.sounds['bounce4']);
    }
},
    {
    w: 20,
    h: 200,
    add: function() {
        $.myplayer.velocityX += 10;
    },
    ontouch: function() {
        $.myplayer.addAnim('grabL');
        $.myplayer.velocityY = -1;
        $.myplayer.velocityX = 0;
        $.myplayer.x = this.x + this.w;
    }
},
    {
    w: 20,
    h: 200,
    add: function() {
        $.myplayer.velocityX -= 10;
    },
    ontouch: function() {
        $.myplayer.addAnim('grab');
        $.myplayer.velocityY = -1;
        $.myplayer.velocityX = 0;
        $.myplayer.x = this.x - $.myplayer.w;
    }
},
    {
    w: 40,
    h: 200,
    style: "base Ltramp",
    ontouch: function() {
        $.myplayer.velocityX = 30;
        $.myplayer.velocityY += 10;
        $.playSound($.sounds['bounce2']);
        $.myplayer.addAnim('bounce');
    }

}, {
    w: 40,
    h: 200,
    style: "base Rtramp",
    ontouch: function() {
        $.myplayer.velocityX = -30;
        $.myplayer.velocityY += 10;
        $.playSound($.sounds['bounce2']);
        $.myplayer.addAnim('bounce');
    }

}
];


