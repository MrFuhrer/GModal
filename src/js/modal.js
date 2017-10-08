/**
 * Created by fuhrer on 6/18/2016.
 */

window.popup = function(data) {
    var self = this;
    var backdrop,popupWrapper,popup,header,content,close,footer,animation = "fade";

    {
        if(!data.content) return console.error("please add contents to the popup");
        backdrop = document.createElement("div");
        popup = document.createElement("div");
        popupWrapper = document.createElement("div");
        content = document.createElement("div");
        close = document.createElement("span");

        close.innerHTML = "&#10006;";
        content.innerHTML=data.content;

        backdrop.classList.add("gpopup-backdrop");
        popup.classList.add("gpopup");
        popupWrapper.classList.add("gpopup-wrapper");
        content.classList.add("gpopup-content");
        close.classList.add("close");

        popupWrapper.appendChild(popup);
        backdrop.appendChild(popupWrapper);

        if(data.animation) {
            self.animation = data.animation;
        }

        if(data.className) {
            if(typeof data.className == "string") backdrop.classList.add(data.className);
            else {
                for(var i = 0; i < data.className.length; i++) {
                    backdrop.classList.add(data.className[i]);
                }
            }
        }


        if(data.title) {
            header = document.createElement("div");
            header.classList.add("header");
            header.innerHTML = data.title;
            header.appendChild(close);
            popup.appendChild(header);
        } else {
            content.appendChild(close);
        }

        popup.appendChild(content);


        if(data.buttons && typeof data.buttons == 'object') {
            footer = document.createElement("div");
            footer.classList.add("backdrop-footer");
            for(var id = 0; id < data.buttons.length; id++) {
                var button = data.buttons[id];
                var btn = document.createElement("button");
                btn.dataset.id = id;

                btn.setAttribute("type","button");

                btn.classList.add("gpopup-btn");
                if(button.className) {
                    btn.classList.add(button.className);
                }
                if(button.focus) {
                    btn.classList.add("focus");
                }

                btn.innerHTML = button.label ? button.label : "Button "+id;

                btn.addEventListener('click',function(e) {
                    data.buttons[e.target.dataset.id].callback(e,self);
                },false);
                footer.appendChild(btn);
            }
            popup.appendChild(footer);
        }

        afterCreate();
    }


    function afterCreate() {
        close.addEventListener('click',function() {
            self.exit();
        },false);

        self.root = backdrop;

        if(data.exitOnBackdropClick) {
            backdrop.addEventListener('click',function() {
                self.exit();
            },false);

            popup.addEventListener('click',function(e){
                e.stopPropagation();
            },false);
        }
    }


    this.exit = function() {
        self.initAnimation();
        setTimeout(function(){
            if(backdrop.parentNode == document.body) {
                document.body.removeChild(backdrop);
            }
            if(!document.querySelector(".gpopup-backdrop")) {
                document.body.style.overflowY = "auto";
            }
            if(data.closeCallback) {
                data.closeCallback();
            }
        },self.animations[self.animation].time);
    };

    this.show = function() {

        if(typeof self.initAnimation == "function") {
            self.initAnimation();
        }

        document.body.style.overflowY = "hidden";
        document.body.appendChild(backdrop);


        if(popup.clientHeight>window.innerHeight*0.4) {
            popupWrapper.style.top = "10%";
        }
        if(backdrop.querySelector(".focus")) {
            backdrop.querySelector(".focus").focus();
        }

        if(typeof self.animate == "function") {
            self.animate();
        }
        return self;
    };

    this.initAnimation = function() {
        if(typeof self.animations[self.animation]!="object") {
            self.animation = "fade";
        }
        self.animations[self.animation].init(this.root);
    };

    this.animate = function() {
        self.animations[self.animation].animate(this.root);
    };

    this.animations = {
        fade: {
            init: function(root) {
                root.style.opacity = "0";
                root.style.transition = "opacity 0.3s ease-in";
            },
            animate: function(root) {
                root.style.opacity = "1";
            },
            time: 300
        },
        slideDown: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.transform = "translate(0,-100px)";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "transform 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.transform = "translate(0,0)";
            },
            time: 300
        },
        slideUp: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.transform = "translate(0,100px)";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "transform 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.transform = "translate(0,0)";
            },
            time: 300
        },
        slideLeft: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.transform = "translate(100px,0)";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "transform 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.transform = "translate(0,0)";
            },
            time: 300
        },
        slideRight: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.transform = "translate(-100px)";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "transform 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.transform = "translate(0,0)";
            },
            time: 300
        }
    }

};
window.initGModal = function() {
    window.alert = function() {
        var title,text,callback,animation;

        var b = typeof arguments[1] == "string";

        text = b ? arguments[1] : arguments[0];
        title = b ? arguments[0] : null;

        callback = b ? arguments[2] : arguments[1];

        animation = b ? arguments[3] : arguments[2];

        var p = new window.popup({
            content: text,
            title: title,
            buttons: [
                {
                    label: "Ok",
                    callback: function(e,p) {
                        p.exit();
                    },
                    focus: true
                }
            ],
            className: "noclose",
            closeCallback: callback,
            animation: animation
        });

        p.show();
        return p;

    };

    window.confirm = function() {

        var title,text,callback,animation;

        var b = typeof arguments[1] === "string";

        text = b ? arguments[1] : arguments[0];
        title = b ? arguments[0] : null;

        callback = b ? arguments[2] : arguments[1];

        animation = b ? arguments[3] : arguments[2];

        var p = new window.popup({
            content: text,
            title: title,
            buttons: [
                {
                    label: "No",
                    callback: function(e,p) {
                        p.exit();
                        callback(false);
                    }
                },
                {
                    label: "Yes",
                    callback: function(e,p) {
                        p.exit();
                        callback(true);
                    },
                    focus: true
                }
            ],
            className: "noclose",
            animation: animation
        });
        p.show();
        return p;
    };

    window.prompt = function(title,value,callback,animation) {
        var p = new window.popup({
            title: title,
            content: "<input type='text' class='gpopup-prompt-input gpopup-input focus' placeholder='Please input' value='"+value+"' >",
            buttons: [
                {
                    label: "Ok",
                    callback: function(e,p) {
                        var val = p.root.querySelector(".gpopup-prompt-input").value;
                        p.exit();
                        callback(val);
                    }
                }
            ],
            className: "noclose",
            animation: animation
        });
        p.show();
        return p;
    };
};
