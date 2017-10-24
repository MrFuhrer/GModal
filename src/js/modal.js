/**
 * Created by fuhrer on 6/18/2016.
 */

window.popup = function(data) {
    var self = this;
    var wrapper,backdrop,popupWrapper,popup,header,content,close,footer,animation = "fade";
 
    create(); 
    afterCreate();

    function create() {
        if(!data.content) return console.error("please add contents to the popup");
        wrapper = document.createElement("div");
        backdrop = document.createElement("div");
        popup = document.createElement("div");
        popupWrapper = document.createElement("div");
        content = document.createElement("div");
        close = document.createElement ("span");

        close.innerHTML = "&#10006;";
        content.innerHTML=data.content;

        wrapper.classList.add("gpopup-container");
        backdrop.classList.add("gpopup-backdrop");
        popup.classList.add("gpopup");
        popupWrapper.classList.add("gpopup-wrapper");
        content.classList.add("gpopup-content");
        close.classList.add("close");

        // popupWrapper.appendChild(popup);
        wrapper.appendChild(popup);
        wrapper.appendChild(backdrop);
        // wrapper.appendChild(popupWrapper);

        if(data.animation) {
            self.animation = data.animation;
        }

        if(data.className) {
            if(typeof data.className === "string") wrapper.classList.add(data.className);
            else {
                for(var i = 0; i < data.className.length; i++) {
                    wrapper.classList.add(data.className[i]);
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


        if(data.buttons && typeof data.buttons === 'object') {
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
    }


    function afterCreate() {
        close.addEventListener('click',function() {
            self.exit();
        },false);

        self.root = wrapper;

        if(data.exitOnBackdropClick) {
            backdrop.addEventListener('click',function() {
                self.exit();
            },false);
        }
    }


    this.exit = function() {
        self.initAnimation();
        setTimeout(function(){
            if(wrapper.parentNode === document.body) {
                document.body.removeChild(wrapper);
            }
            if(!document.querySelector(".gpopup-container")) {
                document.body.style.overflowY = "auto";
            }
            if(data.closeCallback) {
                data.closeCallback();
            }
        },self.animations[self.animation].time);
    };

    this.show = function() {

        if(typeof self.initAnimation === "function") {
            self.initAnimation();
        }

        document.body.style.overflowY = "hidden";
        document.body.appendChild(wrapper);


        if(popup.clientHeight>window.innerHeight*0.4) {
            popup.style.top = "10%";
        }

        console.log(popup.clientHeight + popup.offsetTop, window.oute);
        if(popup.clientHeight + popup.offsetTop >= window.outerHeight) {
            this.root.style.overflowY = "scroll";
        }

        if(popup.querySelector(".focus")) {
            popup.querySelector(".focus").focus();
        }

        if(typeof self.animate === "function") {
            self.animate();
        }
        return self;
    };

    this.initAnimation = function() {
        if(typeof self.animations[self.animation]!=="object") {
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
                root.querySelector(".gpopup").style.marginTop = "-100px";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "margin-top 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.marginTop = "0";
            },
            time: 300
        },
        slideUp: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.marginTop = "100px";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "margin-top 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.marginTop = "0";
            },
            time: 300
        },
        slideLeft: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.marginLeft = "100px";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "margin-left 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.marginLeft = "0";
            },
            time: 300
        },
        slideRight: {
            init: function(root) {
                root.style.opacity = "0";
                root.querySelector(".gpopup").style.marginLeft = "-100px";
                root.style.transition = "opacity 0.3s ease-in";
                root.querySelector(".gpopup").style.transition = "margin-left 0.3s ease-out";
            },
            animate: function(root) {
                root.style.opacity = "1";
                root.querySelector(".gpopup").style.marginLeft = "0";
            },
            time: 300
        }
    }

};
window.initGModal = function() {
    window.alert = function() {
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
