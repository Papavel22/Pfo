$(function () {
    const versions = {
        PROTOTYPE() {
            function Timer(options) {
                this.init(options);
            }

            function TimerPage() {
                this.init();
            }

            Timer.prototype = {
                seconds: 0,
                timer: null,
                config: {
                    defaultTimerValue: '00:00:00',
                  icons: {
                    deleteBtn: '✖',
                    pauseBtn: '||',
                    startBtn: '>'
                  },
                },
                init(options) {
                    this.options = options;
                    this.container = this._bindStructure();
                    this._start();
                    this._bindEvents();
                },

                getContainer() {
                    return this.container;
                },

                _bindEvents() {
                    this.container.find('.del-timer-btn').on('click', () => {
                        this._destroy();
                        this.options.container.trigger('timer:destroy', this.options);
                    });

                    this.container.find('.pause-btn').on('click', () => {
                        this._pause();
                    });

                    this.container.find('.timer').on('click', () => {
                        this._addRound();
                    });
                },

                _bindStructure() {
                    return $(
                        '<div>',
                        {
                            class: 'timer-block',
                            css: {
                                'background-color': this.options.color
                            },
                            html:
                                $('<span>', {class: 'timer', text: this.config.defaultTimerValue}).get(0).outerHTML +
                                $('<button>', {class: 'btn btn-primary timer-btn pause-btn', text: this.config.icons.pauseBtn}).get(0).outerHTML +
                                $('<button>', {class: 'btn btn-danger timer-btn del-timer-btn', text: this.config.icons.deleteBtn}).get(0).outerHTML,
                        });
                },

                _addRound() {
                    const value = $('<span>', {
                        class: 'timer-value ' + this.options.id,
                        text: this.options.name + ' ' + this._getValue(),
                        css: {
                            'background-color': this.options.color
                        },
                    });
                    const sameEl = this.options.valuesContainer.find('.' + this.options.id).last();

                    sameEl.length ? value.insertAfter(sameEl) : this.options.valuesContainer.append(value);
                },

                _destroy() {
                    this.options.valuesContainer.find(`.${this.options.id}`).remove();
                    this.container.remove();
                },

                _start() {
                    this.timer = setTimeout(() => this._tick(), 1000);
                },

                _pause(){
                   if (this.timer) {
                       clearTimeout(this.timer);
                       this.timer = null;
                       this.container.find('.pause-btn').text(this.config.icons.startBtn);
                   } else {
                       this._start();
                       this.container.find('.pause-btn').text(this.config.icons.pauseBtn);
                   }
                },

                _tick() {
                    this.seconds++;
                    this.container.find('.timer').text(this._getValue());
                    this._start();
                },
                _getValue() {
                    let seconds = '' + parseInt(this.seconds % 60);
                    let minutes = '' + parseInt(this.seconds / 60);
                    let hours = '' + parseInt(parseInt(this.seconds / 60) / 60);

                    return [
                        hours.length < 2 ? '0' + hours : hours,
                        minutes.length < 2 ? '0' + minutes : minutes,
                        seconds.length < 2 ? '0' + seconds : seconds,
                    ].join(":")
                },
            };

            TimerPage.prototype = {
                MAX_TIMERS: 4,
                timers: {size: 0},
                init() {
                    this.container = $('.container');
                    this.container.append(this._bindStructure());
                    this.nameInputElement = this.container.find('input');
                    this.btnAddtimer = this.container.find('button');
                    this.timerContainer = this.container.find('.timers-container');
                    this.timerValuesContainer = this.container.find('.timers-values-container');

                    this._bindEvents()
                },
                _bindEvents() {
                    this.btnAddtimer.on('click', () => {
                        this._addTimer();
                    });

                    this.nameInputElement.on('keyup', (e) => {
                        this.btnAddtimer.prop('disabled', !this.nameInputElement.val());
                        if (e.keyCode === 13){
                            this._addTimer();
                        }
                    });

                    this.container.on('timer:destroy', (e, options) => {
                        delete this.timers[options.id];
                        this.timers.size -= 1;
                        this._updateInputState();
                    })
                },
                _bindStructure() {
                    return $(
                        '<div>',
                        {
                            class: 'timer-page',
                            html:
                                $('<input>', { type: 'text' }).get(0).outerHTML +
                                $('<button>', { class: 'btn', text: '+', disabled: true }).get(0).outerHTML +
                                $('<div>', { class: 'timers-container' }).get(0).outerHTML +
                                $('<div>', { class: 'timers-values-container' }).get(0).outerHTML,
                        });
                },
                _addTimer(){
                    const options = {
                        container: this.container,
                        name: this.nameInputElement.val(),
                        valuesContainer: this.timerValuesContainer,
                        color: this.getRandomColor(),
                        id: Date.now(),
                    };

                    this.timers[options.id] = new Timer(options);
                    this.timers.size = this.timers.size + 1;
                    this.timerContainer.append(this.timers[options.id].getContainer());
                    this.nameInputElement.val('');
                    this.btnAddtimer.prop('disabled', true);
                    this._updateInputState();
                },

                _updateInputState() {
                    this.nameInputElement.prop('disabled', this.timers.size >= this.MAX_TIMERS);
                },

                getRandomColor() {
                    const letters = '0123456789ABCDEF';
                    let color = '#';

                    for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }

                    return color;
                }
            };

            new TimerPage()
        },

        ES5() {
            var MAX_TIMERS = 4;
            var timers = {size: 0};
            var config = {
                defaultTimerValue: '00:00:00',
                icons: {
                    deleteBtn: '✖',
                    pauseBtn: '||',
                    startBtn: '>'
                },
            };
            var container = $('.container');
            container.append(getPageStructure());

            var nameInputElement = container.find('input');
            var btnAddtimer = container.find('button');
            var timerContainer = container.find('.timers-container');
            var timerValuesContainer = container.find('.timers-values-container');

            bindPageEvents();


            function bindPageEvents() {
                btnAddtimer.on('click', function() {
                    addTimer();
                });

                nameInputElement.on('keyup', function(e) {
                    btnAddtimer.prop('disabled', !nameInputElement.val());
                    if (e.keyCode === 13){
                        addTimer();
                    }
                });
            }

            function getPageStructure() {
                return $(
                    '<div>',
                    {
                        class: 'timer-page',
                        html:
                            $('<input>', { type: 'text' }).get(0).outerHTML +
                            $('<button>', { class: 'btn', text: '+', disabled: true }).get(0).outerHTML +
                            $('<div>', { class: 'timers-container' }).get(0).outerHTML +
                            $('<div>', { class: 'timers-values-container' }).get(0).outerHTML,
                    });
            }

             function addTimer() {
                 var options = {
                    container: container,
                    name: nameInputElement.val(),
                    valuesContainer: timerValuesContainer,
                    color: getRandomColor(),
                    id: Date.now(),
                };

                timers[options.id] = createTimer(options);
                timers.size = timers.size + 1;
                timerContainer.append(timers[options.id].container);
                nameInputElement.val('');
                btnAddtimer.prop('disabled', true);
                updateInputState();
            }

            function updateInputState() {
                nameInputElement.prop('disabled', timers.size >= MAX_TIMERS);
            }

            function getRandomColor() {
                var letters = '0123456789ABCDEF';
                var color = '#';

                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }

                return color;
            }

            function createTimer(options) {
                var timer = {
                    seconds: 0,
                    options: options,
                    container: $(
                        '<div>',
                        {
                            class: 'timer-block',
                            css: {
                                'background-color': options.color
                            },
                            html:
                                $('<span>', { class: 'timer', text: config.defaultTimerValue }).get(0).outerHTML +
                                $('<button>', {
                                    class: 'btn btn-primary timer-btn pause-btn',
                                    text: config.icons.pauseBtn
                                }).get(0).outerHTML +
                                $('<button>', {
                                    class: 'btn btn-danger timer-btn del-timer-btn',
                                    text: config.icons.deleteBtn
                                }).get(0).outerHTML,
                        })
                };

                var timerHelper = getTimerHelper(timer);

                timer.container.find('.del-timer-btn').on('click', function () {
                    timerHelper.remove();
                });

                timer.container.find('.pause-btn').on('click', function () {
                    timerHelper.pause();
                });

                timer.container.find('.timer').on('click', function () {
                    timerHelper.round();
                });

                timerHelper.start();

                return timer;
            }

            var getTimerHelper = function(timer) {
                return {
                    start: function() {
                        var self = this;
                        timer.timeout = setTimeout(function() {
                            timer.seconds++;
                            timer.container.find('.timer').text(self.value(timer.seconds));
                            self.start(timer);
                        }, 1000);
                    },
                    pause: function() {
                        if (timer.timeout) {
                            clearTimeout(timer.timeout);
                            timer.timeout = null;
                            timer.container.find('.pause-btn').text(config.icons.startBtn);
                        } else {
                            this.start(timer);
                            timer.container.find('.pause-btn').text(config.icons.pauseBtn);
                        }
                    },
                    remove: function() {
                        timer.container.remove();
                        timer.options.valuesContainer.find(`.${timer.options.id}`).remove();
                        delete timers[timer.options.id];
                        timers.size -= 1;
                        updateInputState();
                    },
                    round: function() {
                        var value = $('<span>', {
                            class: 'timer-value ' + timer.options.id,
                            text: timer.options.name + ' ' + timer.container.find('.timer').text(),
                            css: {
                                'background-color': timer.options.color
                            },
                        });
                        var sameEl = timer.options.valuesContainer.find('.' + timer.options.id).last();

                        sameEl.length ? value.insertAfter(sameEl) : timer.options.valuesContainer.append(value);
                    },
                    value: function() {
                        var seconds = '' + parseInt(timer.seconds % 60);
                        var minutes = '' + parseInt(timer.seconds / 60);
                        var hours = '' + parseInt(parseInt(timer.seconds / 60) / 60);

                        return [
                            hours.length < 2 ? '0' + hours : hours,
                            minutes.length < 2 ? '0' + minutes : minutes,
                            seconds.length < 2 ? '0' + seconds : seconds,
                        ].join(":")
                    },
                }
            }
        },

        ES6() {
            class Timer {
                seconds = 0;
                timer = null;
                config = {
                    defaultTimerValue: '00:00:00',
                    icons: {
                        deleteBtn: '✖',
                        pauseBtn: '||',
                        startBtn: '>'
                    },
                };

                constructor(options) {
                    this.options = options;
                    this.container = this._bindStructure();
                    this._start();
                    this._bindEvents();
                }

                _bindStructure() {
                    return $(
                        '<div>',
                        {
                            class: 'timer-block',
                            css: {
                                'background-color': this.options.color
                            },
                            html:
                                $('<span>', {class: 'timer', text: this.config.defaultTimerValue}).get(0).outerHTML +
                                $('<button>', {class: 'btn btn-primary timer-btn pause-btn', text: this.config.icons.pauseBtn}).get(0).outerHTML +
                                    $('<button>', {class: 'btn btn-danger timer-btn del-timer-btn', text: this.config.icons.deleteBtn}).get(0).outerHTML,
                        });
                }

                getContainer() {
                    return this.container;
                }

                _bindEvents() {
                    this.container.find('.del-timer-btn').on('click', () => {
                        this._destroy();
                        this.options.container.trigger('timer:destroy', this.options);
                    });

                    this.container.find('.pause-btn').on('click', () => {
                        this._pause();
                    });

                    this.container.find('.timer').on('click', () => {
                        this._addRound();
                    });
                }

                _addRound() {
                    const value = $('<span>', {
                        class: 'timer-value ' + this.options.id,
                        text: this.options.name + ' ' + timerHelper.generateValue(this.seconds),
                        css: {
                            'background-color': this.options.color
                        },
                    });
                    const sameEl = this.options.valuesContainer.find('.' + this.options.id).last();

                    sameEl.length ? value.insertAfter(sameEl) : this.options.valuesContainer.append(value);
                }

                _destroy() {
                    this.options.valuesContainer.find(`.${this.options.id}`).remove();
                    this.container.remove();
                }

                _start() {
                    this.timer = setTimeout(() => this._tick(), 1000);
                }

                _pause(){
                    if (this.timer) {
                        clearTimeout(this.timer);
                        this.timer = null;
                        this.container.find('.pause-btn').text(this.config.icons.startBtn);
                    } else {
                        this._start();
                        this.container.find('.pause-btn').text(this.config.icons.pauseBtn);
                    }
                }

                _tick() {
                    this.seconds++;
                    this.container.find('.timer').text(timerHelper.generateValue(this.seconds));
                    this._start();
                }
            }

            class TimerPage {
                MAX_TIMERS = 4;
                timers = { size: 0 };

                constructor() {
                    this.container = $('.container');
                    this.container.append(this._bindStructure());
                    this.nameInputElement = this.container.find('input');
                    this.btnAddtimer = this.container.find('button');
                    this.timerContainer = this.container.find('.timers-container');
                    this.timerValuesContainer = this.container.find('.timers-values-container');

                    this._bindEvents()
                }

                _bindStructure() {
                    return $(
                        '<div>',
                        {
                            class: 'timer-page',
                            html:
                                $('<input>', { type: 'text' }).get(0).outerHTML +
                                $('<button>', { class: 'btn', text: '+', disabled: true }).get(0).outerHTML +
                                $('<div>', { class: 'timers-container' }).get(0).outerHTML +
                                $('<div>', { class: 'timers-values-container' }).get(0).outerHTML,
                        });
                }

                _bindEvents() {
                    this.btnAddtimer.on('click', () => {
                        this._addTimer();
                    });

                    this.nameInputElement.on('keyup', (e) => {
                        this.btnAddtimer.prop('disabled', !this.nameInputElement.val());
                        if (e.keyCode === 13){
                            this._addTimer();
                        }
                    });

                    this.container.on('timer:destroy', (e, options) => {
                        delete this.timers[options.id];
                        this.timers.size -= 1;
                        this._updateInputState();
                    })
                }

                _addTimer(){
                    const options = {
                        container: this.container,
                        name: this.nameInputElement.val(),
                        valuesContainer: this.timerValuesContainer,
                        color: timerHelper.getRandomColor(),
                        id: Date.now(),
                    };

                    this.timers[options.id] = new Timer(options);
                    this.timers.size = this.timers.size + 1;
                    this.timerContainer.append(this.timers[options.id].getContainer());
                    this.nameInputElement.val('');
                    this.btnAddtimer.prop('disabled', true);
                    this._updateInputState();
                }

                _updateInputState() {
                    this.nameInputElement.prop('disabled', this.timers.size >= this.MAX_TIMERS);
                }
            }

            class TimerHelper {
                colorHash = '#';
                letters = '0123456789ABCDEF';

                constructor() {}

                getRandomColor() {
                    let color = this.colorHash;

                    for (let i = 0; i < 6; i++) {
                        color += this.letters[Math.floor(Math.random() * 16)];
                    }

                    return color;
                }

                generateValue(currentSeconds) {
                    let seconds = '' + parseInt(currentSeconds % 60);
                    let minutes = '' + parseInt(currentSeconds / 60);
                    let hours = '' + parseInt(parseInt(currentSeconds / 60) / 60);

                    return [
                        hours.length < 2 ? '0' + hours : hours,
                        minutes.length < 2 ? '0' + minutes : minutes,
                        seconds.length < 2 ? '0' + seconds : seconds,
                    ].join(":")
                }
            }

            const timerHelper = new TimerHelper();
            new TimerPage()
        },
    };

    versions.ES6();
});