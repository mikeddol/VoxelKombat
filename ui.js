//Inspired from https://playcanvas.com/project/359952/code
pc.script.attribute("hud", "asset", null, {
    type: "html"
});
pc.script.attribute("start", "asset", null, {
    type: "html"
});
pc.script.attribute("scores", "asset", null, {
    type: "html"
});
pc.script.attribute("css", "asset", null, {
    type: "css"
});

pc.script.create('ui', function(app) {
    // Creates a new Ui instance
    var Ui = function(entity) {
        this.entity = entity;
        this.start = null;
        this.hud = null;
        this.cameraControls = null;
        this.project = null;
        this.jumpFuel = null;
        this.animate = false;
    };

    Ui.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function() {
            var css = app.assets.get(this.css);
            if (css) {
                style = pc.createStyle(css.resource);
                document.head.appendChild(style);
            }
        },
        // Called every frame, dt is time in seconds since last update
        update: function(dt) {
            if (!this.cameraControls || !this.project || !this.jumpFuel)
                return;
            this.handleProjection();
            this.handleJump();
        },
        showStart: function() {
            var asset = app.assets.get(this.start);
            if (asset) {
                this.start = document.createElement("div");
                this.start.id = "start-ui";
                this.start.innerHTML = asset.resource;
                this.start.getElementsByClassName("btn-connect")[0].onclick = this.performConn.bind(this);
                document.body.appendChild(this.start);
            }
        },
        removeStart: function() {
            this.start.remove();
        },
        showHUD: function(controls) {
            var asset = app.assets.get(this.hud);
            this.cameraControls = controls;
            if (asset) {
                this.hud = document.createElement("div");
                this.hud.id = "ui";
                this.hud.innerHTML = asset.resource;
                document.body.appendChild(this.hud);

                this.project = this.hud.getElementsByClassName("projection")[0];
                this.jumpFuel = this.hud.getElementsByClassName("jump-fuel");
            }
        },
        handleProjection: function() {
            if (parseInt(this.cameraControls.timer) >= this.cameraControls.timeStamp) {
                this.project.className = 'projection';
                this.animate = false;
            } else if (parseInt(this.cameraControls.timer) < this.cameraControls.timeStamp && !this.animate) {
                this.project.className = 'projection animate';
                this.animate = true;
            }
        },
        handleJump: function() {
            for (var i = 0; i <= 1; i++) {
                this.jumpFuel[i].style.height = parseInt(this.cameraControls.jumpFuel) + "%";
            }
        },
        removeHUD: function() {
            this.hud.remove();
        },
        performConn: function() {
            this.entity.script.conn.playerConn();
        }
    };

    return Ui;
});