/**
 * Created by yongshangwu on 16/1/26.
 */
var BasePhysicsSprite = cc.PhysicsSprite.extend({
    tmpPosition: cc.p(0, 0),
    type: 0,
    shapeList: null,
    counter_: 0,
    isStatic: false,
    isBodySet: false,

    ctor: function (p) {
        this.shapeList = [];
        this._super(p);
        this.shapeList = [];
    },

    getType: function () {
        return this.type;
    },
    setType: function (t) {
        this.type = t;
    },

    //默认只对此数组的首位进行操作
    getShape: function () {
        //return this.shapeList;
        return this.shapeList[0];
    },
    setShape: function (s) {
        this.shapeList[0] = s;
    },

    //对整个shapeList进行操作，适用于一个body多shape的情况
    getShapeList : function(){
        return this.shapeList;
    },
    setShapeList : function(s){
        this.shapeList  = s;
    },

    getPosition: function () {
        var body = this.getBody();
        var handle = (typeof body.handle == "number") ? body.handle : body.handle[0];
        if (handle) return body.getPos();
        else
            return this.tmpPosition;
    },

    setPosition: function (position) {
        var body = this.getBody();
        var handle = (typeof body.handle == "number") ? body.handle : body.handle[0];
        if (handle)
            if (arguments.length == 1) {
                this.x = position.x;
                this.y = position.y;
                if (handle) {
                    body.setPos(position);
                } else {
                    this.tmpPosition = position;
                }
            } else {
                this.x = arguments[0];
                this.y = arguments[1];
                var p = cc.p(arguments[0], arguments[1]);
                if (handle) {
                    body.setPos(p);
                }
                else {
                    this.tmpPosition = p;
                }
            }/*
         if(this._armature){
         this._armature.x = position.x;
         this._armature.y = position.y;
         }*/
    },


    onCollision: function (type, sprite) {
        return true;
    },

    removeSelf: function () {
        if (blockCallback) {
            return;
        }

        ++this.counter_;
        sharedSpace.addPostStepCallback(function () {
            if (--this.counter_ == 0) {
                this.removeSelfImmediate();
            }
        }.bind(this));
    },

    removeSelfImmediate: function() {
        var shapeList = this.getShapeList();
        for (var i = 0; i < shapeList.length; ++i) {
            sharedSpace.removeShape(shapeList[i]);
        }
        if (!this.isStatic) {
            sharedSpace.removeBody(this.getBody());
        }
        this.removeFromParent();
    }
});