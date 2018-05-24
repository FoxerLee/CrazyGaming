$.player = function() {
    this.htmlOBJ = document.getElementById("bob");
//        this.eyelOBJ = document.getElementById("eyeLeft");
//        this.eyerOBJ = document.getElementById("eyeRight");
    this.bodyOBJ = document.getElementById("bobody");
    this.x = 600;
    this.y = 710;
    this.weight = 1;

    this.velocityY = 0;
    this.velocityX = 0;

    this.latMovement = 1;

    this.maxJumpHeight = 30;
    this.w = 20;
    this.h = 31;
    this.gravity = -15;

    this.lastJump = 0;
    this.currjump = 0;

    this.lastVX = 0;

    this.status = true;
    this.htmlOBJ.style.left = $.W / 2 + "px";
    this.htmlOBJ.style.top = $.H / 2.5 + "px";
};


$.player.prototype.reset = function() {
    this.weight = 1;
    this.velocityY = 0;
    this.velocityX = 0;
//        this.eyelOBJ.style.left = "7px";
//        this.eyerOBJ.style.left = "23px";
    this.htmlOBJ.style.transform = "rotate(0deg) rotateY(0deg)";

    this.status = true;
};

$.player.prototype.jump = function() {
    this.velocityY = this.maxJumpHeight;
    $.playSound($.sounds['jump']);
};

$.player.prototype.moveLeft = function() {
    if (this.velocityX > -7) {
        this.velocityX -= this.latMovement;
    }
};


$.player.prototype.moveRight = function() {
    if (this.velocityX < 7) {
        this.velocityX += this.latMovement;
    }

};

$.player.prototype.checkCollision = function(objs) {
    var _objs = [];
    var i = objs.length;
    while (i--) {
        if ($.util.rectInRect(this, objs[i])) {
            _objs.push({
                hit: true,
                e: objs[i]
            });
        }
    }
    return _objs;
};

$.player.prototype.addAnim = function(type) {
    if (type && type !== "success") {
        if (type.substring(0, 4) === "walk" && this.bodyOBJ.className === type) {
            return;
        }
        this.bodyOBJ.className = "";
        void this.bodyOBJ.offsetWidth;
        if (type) {
            this.bodyOBJ.classList.add(type)
        }
    }
    else {
        this.htmlOBJ.className = "";
        void this.htmlOBJ.offsetWidth;
        if (type) {
            this.htmlOBJ.classList.add(type)
        }
    }

};

$.player.prototype.success = function() {
    this.status = false;
    this.addAnim('success');
    $.state.nextLevel();
    $.util.popChat(window.innerWidth / 2, ($.H / 2.5) - 25, ["BOOOOOYAH!!!!"]);

    this.htmlOBJ.addEventListener("animationend", AnimationEnded, false);

    function AnimationEnded(e) {
        if (e.animationName === "success") {
            //  $.state.destroy();
            $.state.showSelecter();
            e.currentTarget.removeEventListener("animationend", AnimationEnded, false);
        }

    }
};

$.player.prototype.update = function(objs) {
    if (!this.status) {
        return
    }

    this.lastJump = this.currjump;
    this.currjump = $.key.space;
    var doJump = !!(this.lastJump === 0 & this.currjump === 1);

    if ($.key.left) {
        this.moveLeft();
    }
    else if ($.key.right) {
        this.moveRight();
    }


    var collide = this.checkCollision(objs);

    var i = collide.length;
    while (i--) {
        if (collide[i].hit) {

            collide[i].e.ontouch();
            if (doJump) {
                this.jump();
                this.addAnim('bounce');
                collide[i].e.add();
            }


        }
    }

    // 设置的最大下落距离，为-15
    if (this.velocityY > this.gravity) {
        this.velocityY -= this.weight;

    }
    if (this.lastVX !== this.velocityX.toFixed(1)) {
        // 主要在这里实现移动
        if (this.velocityY >= 0 && this.velocityY <= 1) {
            if (this.velocityX < 1.5 && this.velocityX > -1.5) {
                // 速度过小，就停止移动
                if (this.bodyOBJ.className.substring(0, 4) === "walk") {
                    this.bodyOBJ.className = ""
                }
            }
            else if (this.velocityX < -1.5) {
                // 向左移动
                $.myplayer.addAnim('walk');
            }
            else if (this.velocityX > 1.5) {
                // 向右移动
                $.myplayer.addAnim('walkR');
            }
        }

//            this.eyelOBJ.style.left = (7 + (this.velocityX.toFixed(2) / 2)) + "px";
//            this.eyerOBJ.style.left = (23 + (this.velocityX.toFixed(2) / 2)) + "px";
        this.htmlOBJ.style.transform = "rotate(" + $.util.range(this.velocityX.toFixed(1) * 2, 21) + "deg) rotateY(" + $.util.range(this.velocityX.toFixed(1) * 6, 40) + "deg)";
    }
    this.lastVX = this.velocityX.toFixed(1);

    this.y -= this.velocityY;
    this.x += this.velocityX;
};