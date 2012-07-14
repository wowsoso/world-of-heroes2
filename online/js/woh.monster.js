/**
 * 人物或者怪物 
 */


Laro.NS('woh', function (L) {


    var Monster = woh.Sprite.extend(function () {
        this.speed = 100;
    }).methods({
        getAnimationGroup: function (type) {
            L.$lea.setLoader(woh.loader);

            var obj = this.data[type];
            ret = [];
            if (!Array.isArray(obj)) {
                obj = [obj];
            }
            L.$lea.setSourceObj(obj);
            for (var i = 0; i < obj.length; i++) {
                ret.push(L.$lea.getAnimation(i));
            }

            return ret;
        },
        initCheckArea: function () {
            var me = this;
            this.checkRect = new L.Sprite(woh.stage.$, function () {
                this.width = 0;
                this.height = 0;

                this.setPos = function (x, y) {
                    this.x = x;
                    this.y = y;
                };

                this.setPos(me.x, me.y);
                this.draw = function (rd) {
                    rd.drawRect(0, 0, this.width, this.height, '#000');
                }
            });

            // this.checkRect.addEventListener('mousedown', function (x, y) {
            //     me.canMove = false;
            // });
        },
        draw: function (render) {
            var x = Math.floor(this.x), y = Math.floor(this.y),
                me = this;

            this.curAnimation && this.curAnimation.forEach(function (o) {
                ((me.face == 'left' && !o.renderMirrored) || (me.face == 'right' && o.renderMirrored)) && o.mirror();
                o.draw(render, x, y, 0, 1, null);
            });
            this.drawHPBar(render);
            //console.log(ctx);

        },

        normalAttack: function () {
            this.fsm.setState(woh.roleStates.attack);
        }
    });
    this.Monster = Monster;
});