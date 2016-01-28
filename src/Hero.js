/**
 * Created by yongshangwu on 16/1/26.
 */
var Hero = BasePhysicsSprite.extend({
    anim: null,
    ctor : function(){
        this._super();
        ccs.armatureDataManager.addArmatureFileInfo(res.Hero_png, res.Hero_plist, res.Hero_json);
        this.anim = ccs.Armature.create("hero2-reborn");
        this.anim.setScale(0.13);
        this.addChild(this.anim);
        this.anim.getAnimation().play("move-front2");
        this.initPhysics();
        
        //var size = cc.size(70, 70);
        //this.setContentSize(size);
        //initPhysicsSprite(this, 1, 10, 1, 1, cc.p(100,200), false);
    },
    initPhysics : function(){
        var mass = 10;
        var phBody = sharedSpace.addBody(new cp.Body(mass, Infinity));
        phBody.setPos(cc.p(70, 70));
        var shape = null;
        shape = sharedSpace.addShape(new cp.BoxShape(phBody, 100, 100));
        shape.setFriction(1);
        shape.setElasticity(1);
        this.setBody(phBody);
        this.setType(1);
        this.setShape(shape);
        this.isStatic = false;
        shape.hashid = this;
    },
});