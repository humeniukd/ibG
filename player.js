window.Player = (function(){
    function raf() {
        this._raf || (
            this._raf = window.requestAnimationFrame(this.update)
        )
    }
    function drawTimer(){
        _timerCtx.clearRect(0,0,200,20);
        _timerCtx.fillText(moment(_pts).format('DD-MM-YYYY HH:mm:ss.SSS'), 0, 12);
    };
    function draw(){
        onTerminalPositionChange(_point.x, _point.y, _point.level);
        drawTimer();
    };

    var i = 0, _timerCtx, _pts, _point, _queue = new Queue();

    return function (from, to, timerCtx, speed) {

        this.getQueue = function () {
            return _queue;
        };

        this.stop = function () {
            _queue.flush();
            window.cancelAnimationFrame(this._raf);
            this._raf = null;
        };

        this.update = function (now) {
            this._raf = null;

            var ms = (now - this._start) * this._speed;
                _pts = this._from + ms; //the time is now

            if(_pts > this._to || _queue.isEmpty())
                return;

            _point = _queue.peek(); //get point

            draw();

            while(_point && _pts > parseInt(_point.timestamp)){
                _point = _queue.dequeue();
                i++;
            }

            raf.apply(this);
        };

        this.load = function (points) {
            _queue.enqueue(points);
            this.start();
        };

        this.start = function () {
            if(this._raf === null){
                this.update(window.performance.now())
            }
        };

        this._start = window.performance.now();
        this._raf = null;
        this._from = from;
        this._to = to;
        this._speed = speed || 1;
        _timerCtx = timerCtx;
        this.update = this.update.bind(this);

        eventize(this);

        return this;
    };
}())