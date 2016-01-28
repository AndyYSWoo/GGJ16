/**
 * Created by yongshangwu on 16/1/26.
 */
var sharedSpace;
var hero;
var initPhysicsSprite = function(sprite, type, mass, friction, elasticity, position,isStatic) {
    var nodeSize = sprite.getContentSize();
    if (mass == undefined)
        mass = 10;
    if (isStatic === true) {
        var phBody = new cp.Body(Infinity, Infinity);
    } else {
        var phBody = sharedSpace.addBody(new cp.Body(mass,
            Infinity));
    }
    if (position != undefined) {
        phBody.setPos(position);
    }
    var shape = null;
    if(isStatic === true){
        shape = sharedSpace.addStaticShape(new cp.BoxShape(phBody,
            nodeSize.width, nodeSize.height));
    }
    else{
        shape = sharedSpace.addShape(new cp.BoxShape(phBody,
            nodeSize.width, nodeSize.height));
    }
    shape.setFriction(friction || 1);
    shape.setElasticity(elasticity || 1);
    sprite.setBody(phBody);
    sprite.setType(type);
    sprite.setShape(shape);
    sprite.isStatic = isStatic;
    shape.hashid = sprite;
};

var MainLayer = cc.Layer.extend({
    winSize : null,
    ctor : function(){
        this._super();
        this.init();
    },
    init : function(){
        this._super();
        this.winSize = cc.director.getWinSize();
        var centerpos = cc.p(this.winSize.width/2, this.winSize.height/2);
        var spritebg = cc.Sprite.create(res.BackGround_png);
        spritebg.setPosition(centerpos);
        this.addChild(spritebg);
        hero = new Hero();
        this.addChild(hero);
    },
    update : function(dt){
        sharedSpace.step(1 / 60.0);
    },
});

var MainScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        this.initPhysics();
    },
    onEnter : function(){
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    },
    initPhysics : function() {
        var space = new cp.Space();
        space.gravity = cp.v(0, 0);
        space.iterations = 30;
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.1;

        space.setDefaultCollisionHandler(MainScene.onCollisionStart,
            null, null, null);

        //Debug Node
        this.addChild(cc.PhysicsDebugNode.create(space), 10);
        sharedSpace = space;
    },
    onCollisionStart : function(arbiter, space) {
        var spriteA = arbiter.a.hashid, spriteB = arbiter.b.hashid;
        var typeA, typeB;
        if (spriteA instanceof Object) {
            typeA = spriteA.getType();
        } else {
            typeA = arbiter.a.collision_type;
        }
        if (spriteB instanceof Object) {
            typeB = spriteB.getType();
        } else {
            typeB = arbiter.b.collision_type;
        }
        var retA = true, retB = true;
        if (spriteA instanceof Object) {
            retA = spriteA.onCollision(typeB, spriteB);
        }
        if (spriteB instanceof Object) {
            retB = spriteB.onCollision(typeA, spriteA);
        }
        return retA && retB;
    }
});