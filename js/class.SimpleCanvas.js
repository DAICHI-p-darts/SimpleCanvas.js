/*
* HTML5 SimpleCanvas
* Version: 0.10 BETA
* Copyright (c) 2020 ProjectDARTS @ DAICHI
*/

class SimpleCanvas {

    canvas_id;
    canvas;

    constructor(canvas_id) {
        this.canvas_id = canvas_id;
        this.canvas = document.getElementById(this.canvas_id);
        return (this.canvas.getContext) ? this : false;
    }

    get canvas_id() {
        return this.canvas_id;
    }

    get canvas() {
        return this.canvas;
    }

    get width() {
        return this.canvas.clientWidth;
    }

    get height() {
        return this.canvas.clientHeight;
    }

    loadImage(src, options = {}) {
        if (typeof options != "object") {
            return false;
        }

        const defaultOptions = {
            clear: true
        };
        options = Object.assign(defaultOptions, options);

        const ctx = this.canvas.getContext('2d');
        if (options.clear) {
            //canvas clear
            ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }

        //画像読み込み
        const loadImage = new Image();
        loadImage.src = src;
        ctx.drawImage(loadImage, 0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        return this;
    }

    drawLine(options = {}) {
        if (typeof options != "object") {
            return false;
        }

        const defaultOptions = {
            start: { left: 0, top: 0 },
            end: { left: 0, top: 0 },
            color: "#000000",
            width: 2,
            clear: false
        };

        options = Object.assign(defaultOptions, options);

        const ctx = this.canvas.getContext('2d');
        if (options.clear) {
            //canvas clear
            ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }

        ctx.strokeStyle = options.color;
        ctx.lineWidth = options.width;

        ctx.beginPath();
        ctx.moveTo(options.start.left, options.start.top);
        ctx.lineTo(options.end.left, options.end.top);
        ctx.stroke();

        return this;

    }

    drawText(text, options = {}) {

        if (typeof options != "object") {
            return false;
        }

        const defaultOptions = {
            top: 0,
            left: 0,
            bold: false,
            fontColor: "#000000",
            fontSize: 20,
            fontFamly: "Yu Gothic",
            borderWidth: 0, //枠線幅(0以上の整数 pxではない。)
            borderColor: "#ffffff",　//枠線の色
            clear: true
        };

        options = Object.assign(defaultOptions, options);

        const ctx = this.canvas.getContext('2d');
        if (options.clear) {
            //canvas clear
            ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }

        let fontOptions = [];
        if (options.bold) {
            fontOptions.push("bold");
        }

        fontOptions.push(options.fontSize + "px");
        fontOptions.push("'" + options.fontFamily + "'");

        const x = options.left;
        const y = options.top + options.fontSize;

        ctx.font = fontOptions.join(" ");
        const splitText = text.split("\n");

        ctx.fillStyle = options.fontColor;
        ctx.lineWidth = options.borderWidth;
        ctx.strokeStyle = options.borderColor;

        splitText.forEach(function (text, index) {
            const mesure = ctx.measureText(text);
            ctx.fillText(text, x, y + ((options.fontSize) * index));
            if (options.borderWidth > 0) {
                ctx.strokeText(text, x, y + ((options.fontSize) * index));
            }
        })

        return this;
    }

    drawSquare(options = {}) {
        if (typeof options != "object") {
            return false;
        }
        const defaultOptions = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            radius: 0,
            borderWidth: 0,
            borderColor: "#666666",
            backgroundColor: "#666666",
            clear: true
        };
        options = Object.assign(defaultOptions, options);

        const ctx = this.canvas.getContext('2d');
        if (options.clear) {
            ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        }

        ctx.beginPath();
        ctx.lineWidth = options.borderWidth;
        ctx.strokeStyle = options.borderColor;
        ctx.fillStyle = options.backgroundColor;

        ctx.moveTo(options.left + options.radius, options.top);
        ctx.lineTo(options.left + options.width - options.radius, options.top);
        ctx.arc(options.left + options.width - options.radius, options.top + options.radius, options.radius, Math.PI * 1.5, 0, false);
        ctx.lineTo(options.left + options.width, options.top + options.height - options.radius);
        ctx.arc(options.left + options.width - options.radius, options.top + options.height - options.radius, options.radius, 0, Math.PI * 0.5, false);
        ctx.lineTo(options.left + options.radius, options.top + options.height);
        ctx.arc(options.left + options.radius, options.top + options.height - options.radius, options.radius, Math.PI * 0.5, Math.PI, false);
        ctx.lineTo(options.left, options.top + options.radius);
        ctx.arc(options.left + options.radius, options.top + options.radius, options.radius, Math.PI, Math.PI * 1.5, false);

        ctx.closePath();
        ctx.fill();

        return this;
    }

    concatCanvas(SimpleCanvas, options = {}) {

        if (!SimpleCanvas.canvas.getContext || typeof options != "object") {
            return false;
        }

        const defaultOptions = {
            left: 0,
            top: 0,
        };
        options = Object.assign(defaultOptions, options);

        const ctx = this.canvas.getContext('2d');
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(SimpleCanvas.canvas, options.left, options.top);

        return this;
    }

    clear() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    get png() {
        return this.canvas.toDataURL("image/png");
    }
    get jpeg() {
        return this.canvas.toDataURL("image/jpeg");
    }

    download(type = "png", filename = "save") {
        const mimetype = (type == "png") ? "image/png" : "image/jpeg";
        const ext = (type == "png") ? "png" : "jpg";
        const base64 = this.canvas.toDataURL(mimetype);
        const dlElm = document.createElement("a");
        dlElm.href = base64;
        dlElm.setAttribute("download", filename + "." + ext);
        dlElm.click();
        dlElm.remove();
        return this;
    }
};