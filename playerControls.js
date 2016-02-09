// playerControls.js
pc.script.attribute("power", "number", 10000);

pc.script.attribute("projectionModifier", "number", 200);

pc.script.create("playerControls", function(app) {
    var moveForce = new pc.Vec3();

    var jumpForce = new pc.Vec3();

    var projectionForce = new pc.Vec3();

    var PlayerControls = function(entity) {
        this.entity = entity;

        this.player = null;

        this.camera = null;

        this.releasedJump = true;

        this.pressedJump = false;

        // Listen for mouseclicks and handle them accordingly
        app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);

        app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    };

    PlayerControls.prototype = {
        name: "PlayerName",
        initialize: function() {
        },
        init: function(player, camera) {
            this.player = player;
            this.camera = camera;
        },
        update: function(dt) {
            if(!this.player)
                return;
            this.handleMovement();
            this.jump();
        },
        handleMovement: function() {
            if(!this.player || !this.camera)
                return;
            var forward = this.camera.forward;
            var right = this.camera.right;

            var x = 0;
            var z = 0;

            if (app.keyboard.isPressed(pc.KEY_A)) {
                x -= right.x;
                z -= right.z;
            }
            if (app.keyboard.isPressed(pc.KEY_D)) {
                x += right.x;
                z += right.z;
            }

            if (app.keyboard.isPressed(pc.KEY_W)) {
                x += forward.x;
                z += forward.z;
            }

            if (app.keyboard.isPressed(pc.KEY_S)) {
                x -= forward.x;
                z -= forward.z;
            }

            if (x !== 0 && z !== 0) {
                moveForce.set(x, 0, z).normalize().scale(this.power);
                this.player.rigidbody.applyForce(moveForce);
            }
        },
        jump: function() {
            if(!this.player)
                return;
            if (this.pressedJump) {
                jumpForce.set(0, 1, 0).normalize().scale(this.power);
                this.player.rigidbody.applyForce(jumpForce);
            } else if (this.releasedJump && this.player.getPosition().y >= 0) {
                jumpForce.set(0, -1, 0).normalize().scale(this.power);
                this.player.rigidbody.applyForce(jumpForce);
            }
        },
        attack: function() {
            if(!this.player || !this.camera)
                return;
            var forward = this.camera.forward;
            projectionForce.set(forward.x, forward.y, forward.z).normalize().scale(this.power * this.projectionModifier);
            this.player.rigidbody.applyForce(projectionForce);
        },
        onMouseDown: function(event) {
            if(!this.player)
                return;
            if(this.player.enabled) {
                app.mouse.enablePointerLock();
            }
            if (!pc.Mouse.isPointerLocked()) {
                return;
            }

            if (event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = true;
                this.releasedJump = false;
            }

            if (event.button === pc.MOUSEBUTTON_LEFT) {
                this.attack();
            }
        },
        onMouseUp: function(event) {
            if(!this.player)
                return;
            if (event.button === pc.MOUSEBUTTON_RIGHT) {
                this.pressedJump = false;
                this.releasedJump = true;
            }
        }
    };

    return PlayerControls;
});