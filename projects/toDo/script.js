$(function () {


    class Page {

        constructor() {
            this.container = $('.container');
            this.datesContainer = new EventsStaked(this.container);
            this.form = new Form(this.container);
            this.container.append(this.datesContainer.getContainer());
            this._bindEvents()
        }


        _bindEvents() {

        }

    }


    class Validation {
        constructor ( ) {

        }

        validating(formData, busyTime,){
            this.busyTime = busyTime;
            this.startTime = formData.startTime;
            this.finishTime = formData.finishTime;
            this.date = formData.date;
            this.id = formData.id;
            this.validationResult =true;

            for(let time of this.busyTime) {
                if (time.date === this.date) {
                    if (time.id !== this.id) {
                        if (!(this.startTime < time.startTime && this.finishTime <= time.finishTime
                            || this.startTime >= time.finishTime && this.finishTime > time.finishTime)) {
                            return false
                        }
                    }

                }
            }

            return this.validationResult
        }

    }

    class Alerts {
        constructor(){
            this.container = this._bindStructure();
            this.alertError = this.container.find('.alert-danger');
            this.alertSuccess = this.container.find('.alert-success');
            this.hideAlert()
        }

        _bindStructure (){
            return $('<div>', {
                html:$('<div>',  { class:'alert alert-danger', text: 'This time for this date is already scheduled'}).get(0).outerHTML
            })
        }

        showError(){
            this.alertError.show()
        }


        hideAlert(){
            this.alertError.hide();
        }

        getContainer(){
            return this.container
        }
    }

    class Form {
        constructor(container) {
            this.eventsContainer = container;
            this.container = this.eventsContainer.find('form');
            this.alert = new Alerts();
            this.container.prepend(this.alert.getContainer());
            this.nameInput = this.container.find('#name');
            this.dateInput = this.container.find('#date');
            this.startTimeInput = this.container.find('#start-time');
            this.finishTimeInput = this.container.find('#finish-time');
            this.addEventBtn = this.container.find('#submit');
            this.validation = new Validation();
            this._binsEvents()
        }


        busyTime = [];
        datesWithEvents = [];

        _bindStructure() {
            return $('<form>', {
                class: 'form',
                html: $('<div>',{class:'alert alert-danger', text:'Event with this time already exist'}).get(0).outerHTML +
                    $('<div>',{
                        class:'form-group',
                        html: $('<label>', {
                                for:'name',
                                text:'name'
                            }).get(0).outerHTML +
                            $('<input>',{
                                type:'text',
                                id:'name',
                                name:'name',
                                class:'form-control'
                            }).get(0).outerHTML
                    }).get(0).outerHTML +
                    $('<div>',{
                        class:'form-group',
                        html: $('<label>', {for:'date', text:'date'}).get(0).outerHTML +
                            $('<input>',{type:'date',
                                id:'date',
                                name:'date',
                                class:'form-control'
                            }).get(0).outerHTML
                    }).get(0).outerHTML +
                    $('<div>',{
                        class:'form-group',
                        html: $('<label>', {for:'start-time', text:'start time'}).get(0).outerHTML +
                            $('<input>',{
                                type:'time',
                                id:'start-time',
                                name:'start-time',
                                class:'form-control'
                            }).get(0).outerHTML
                    }).get(0).outerHTML +
                    $('<div>',{
                        class:'form-group',
                        html: $('<label>', {for:'finish-time', text:'finish time'}).get(0).outerHTML +
                            $('<input>',{type:'time', id:'finish-time',
                                name:'finish-time', class:'form-control'}).get(0).outerHTML
                    }).get(0).outerHTML +
                    $('<button>', {type: 'submit', class:'btn btn-default btnSub', text:'add'}).get(0).outerHTML
            });

        }
        _binsEvents(){
            this.container.find('input').on('input', () => this.alert.hideAlert());
            this.container.on('submit',(e) => {
                e.preventDefault();
                this.onAChange();
            });
            this.startTimeInput.on('input', () => this.editTimeFinishInput());
            this.finishTimeInput.on('input', () => this.onBtnClick());
            this.eventsContainer.on('del:event', (e, options) => this.delBusyTime(options));
            this.eventsContainer.on('check:edit:event', (e, options) => {
                this.checkEditEvent(options)
            });
            this.eventsContainer.on('add:edit:event', (e, options) => {
                this.editBusyTime(options)
            })

        }

        checkEditEvent(options){

            if (!this.validation.validating(options, this.busyTime)) {
                this.eventsContainer.trigger('timeIsBusy:edit:event',options);
            } else {
                this.eventsContainer.trigger('timeIsFree:edit:event',options);
            }
        }

        editBusyTime(options){
            for (let eventOptions of this.busyTime) {
                if (eventOptions.id === options.id) {
                    eventOptions.startTime = options.startTime;
                    eventOptions.finishTime = options.finishTime;
                }
            }
        }

        editTimeFinishInput (){
            this.alert.hideAlert();
            this.finishTimeInput.val('');
            this.finishTimeInput[0].min = `${parseFloat(this.startTimeInput.val())+1}:00`;
        }

        delBusyTime (options){
            for(let eventOptions of this.busyTime){
                if (eventOptions.id === options.id){
                    this.busyTime.splice(this.busyTime.indexOf(eventOptions), 1);
                }
            }
        }

        onBtnClick () {
            const formData = {
                date: this.dateInput.val(),
                startTime: this.startTimeInput.val(),
                finishTime: this.finishTimeInput.val(),

            };
            if (!this.datesWithEvents.includes(formData.date)) {
                this.datesWithEvents.push(formData.date);
                this.addEventBtn.prop('disabled', false);


            } else {
                if (!this.validation.validating(formData, this.busyTime, this.datesWithEvents)) {
                    this.alert.showError();
                    this.addEventBtn.prop('disabled', true);
                } else {
                    this.addEventBtn.prop('disabled', false);
                }
            }
        }

        onAChange (){
            const formData = {
                name: this.nameInput.val(),
                date: this.dateInput.val(),
                startTime: this.startTimeInput.val(),
                finishTime: this.finishTimeInput.val(),
                id: Math.floor(Math.random() * (19999999 - 1 + 1)) + 1,
                eventsContainer: this.eventsContainer

            };
            this.busyTime.push(formData);
            this.eventsContainer.trigger('addEvent', formData);
            this.container.find('input').val('')
        }

        getContainer(){
            return this.container
        }
    }

    class Event {
        constructor(options) {
            this.options =options;
            this.eventsContainer = this.options.eventsContainer;
            this.container = this._bindStructure();
            this.input = this.container.find('.event-input');
            this.editStartTimeInput = this.container.find('.edit-start-time-input');
            this.editFinishTimeInput = this.container.find('.edit-finish-time-input');


            this._bindEvents()
        }

        _bindStructure() {
            return $('<div>', {
                class: 'event row',
                id:this.options.id,
                html:
                    $('<span>', {class: 'name col-md-3', text: this.options.name}).get(0).outerHTML +
                    $('<input>', {
                        class:`edit-start-time-input event-input col-md-3`,
                        min:'09:00',
                        max:'17:00',
                        value: this.options.startTime,
                        type:'time',
                        readonly:true
                    }).get(0).outerHTML +
                    $('<input>', {
                        class:'edit-finish-time-input event-input col-md-3',
                        min:'10:00',
                        max:'18:00',
                        value: this.options.finishTime,
                        type:'time',
                        readonly:true
                    }).get(0).outerHTML +
                    $('<button>', {
                        class:'event-btn',
                        id:'edit-btn',
                        html: $('<i>', {class:'event-btn fas fa-edit col-md-1 padding-none'}).get(0).outerHTML
                    }).get(0).outerHTML +
                    $('<button>', {
                        class:'event-btn',
                        id:'del-btn',
                        html: $('<i>', {class:' event-btn fas fa-trash-alt col-md-1 padding-none'}).get(0).outerHTML
                    }).get(0).outerHTML
            });

        }



        _bindEvents(){

            this.eventsContainer.on('timeIsBusy:edit:event',(e, options) => {
                if (this.options.id === options.id ) {this.timeIsBusy()}
            });
                        this.eventsContainer.on('timeIsFree:edit:event',(e, options) => {
                if (this.options.id === options.id ) {this.container.find('#edit-btn').prop('disabled', false)}
            });
            this.container.find('#del-btn').on('click',() =>{
                this.container.remove();
                $(this.container.find('#edit-btn')).removeClass('clicked');
                this.eventsContainer.trigger('del:event', this.options);
            });
            this.container.find('#edit-btn').on('click',() => {
                if (!$(this.container.find('#edit-btn')).hasClass('clicked')) {
                    $(this.container.find('#edit-btn')).addClass('clicked');
                    this.input.prop('readonly', false)
                } else {
                    this.container.find('#edit-btn').removeClass('clicked');
                    this.eventsContainer.trigger('add:edit:event', this.newOptions);
                    this.input.prop('readonly', true);
                    this.container.remove()
                }
            });
            this.editStartTimeInput.on('input', () => this.editTimeFinishInput());
            this.editFinishTimeInput.on('input', () =>{
                this.checkBusyTime();
            });
        }

        editTimeFinishInput (){
            this.container.find('#edit-btn').prop('disabled', true);
            this.editFinishTimeInput.val('');
            this.editFinishTimeInput[0].min = `${parseFloat(this.editStartTimeInput.val())+1}:00`;
        }

        timeIsBusy(){
            this.input.css('border', 'solid red 1px');
            this.container.append($('<div>', { class: 'err', text: 'This time for this date is already scheduled'}))
        }

        checkBusyTime(){
            this.newOptions = {
                name: this.options.name,
                id: this.options.id,
                date: this.options.date,
                eventsContainer: this.options.eventsContainer,
                startTime: this.editStartTimeInput.val(),
                finishTime: this.editFinishTimeInput.val()
            };
            this.container.find('.err').remove();
            this.input.css('border', '');
            if (this.editStartTimeInput.val()!== this.options.startTime || this.editFinishTimeInput.val()!== this.options.finishTime){

                this.eventsContainer.trigger('check:edit:event', this.newOptions);
            } else {
                this.container.find('#edit-btn').prop('disabled', false);
            }
        }

        getContainer(){
            return this.container
        }
    }


    class EventsStaked {
        event = [];
        optionsStacked = [];
        datesWithEvents = [];
        maxMargin = 0;
        margin = 0;


        constructor(container) {
            this.container = this._bindStructure();
            this.datesWrapper = this.container.find('.dates-wrapper');
            this.eventsContainer = container;
            this._bindEvents();
        }

        _bindEvents() {
            this.container.on('click','.scroll-btn',(e) => this.onClick(e));
            this.eventsContainer.on('addEvent',(e, options) => this.checkDatesOfEvent(options));
            this.eventsContainer.on('del:event', (e, options) => this.delEvent(options));
            this.eventsContainer.on('add:edit:event', (e, options) => {
                this.delEvent(options);
                this.checkDatesOfEvent(options)
            });

        }

        onClick (e){
            this.maxMargin = (parseInt(this.datesWithEvents.length / 3) * -450);
            console.log(this.datesWithEvents.length / 3);
            if (e.target.id === 'date-list-get-prev') {
                if (this.margin!== 0 ){this.margin += 450} else {this.margin = this.maxMargin}
            }
            if (e.target.id === 'date-list-get-next') {
                if (this.margin!== this.maxMargin){this.margin -= 450} else {this.margin = 0}
            }
            console.log(this.margin, this.maxMargin);
            this.scroll(this.margin)
        }

        scroll (margin){
            this.datesWrapper.animate(
                { 'marginTop':`${margin}px` },
                1000);
        }

        _bindStructure() {
            return $('<div>', {
                class: ' events-stacked',
                html: $('<div>',{
                        class: 'scroll-btn',
                        id: 'date-list-get-prev'
                    }).get(0).outerHTML+
                    $('<div>',{
                        class:' dates-container',
                        html:$('<div>',{
                            class: 'dates-wrapper'
                        }).get(0).outerHTML
                    }).get(0).outerHTML+
                    $('<div>',{
                        class: 'scroll-btn',
                        id: 'date-list-get-next'
                    }).get(0).outerHTML
            })
        }

        checkEventsOnThisDate(checksDate) {
            let checkEventsOnThisDatesResult = false;
            for (let event of this.optionsStacked) {
                if (event.date === checksDate) {
                    checkEventsOnThisDatesResult = true
                }
            }
            return checkEventsOnThisDatesResult
        }

        checkDatesOfEvent(options){
            if (this.datesWithEvents.includes(options.date)){
                this.addEvent(options)
            } else {
                this.datesWithEvents.push(options.date);
                this.datesWithEvents.sort();
                this.renderDate();
                this.addEvent(options)
            }
        }

        delDate(date){
            this.container.find(`#${date}`).remove();
            this.datesWithEvents.splice(this.datesWithEvents.indexOf(date), 1);

        }

        addEvent(options){
            this.optionsStacked.push(options);
            this.optionsStacked.sort((a,b) => {
                if(a.startTime > b.startTime){return 1}
                if(a.startTime < b.startTime){return -1}
            });
            this.renderEvents(options)
        }

        delEvent(options) {
            delete this.event[options.id];
            for(let eventOptions of this.optionsStacked){
                if (eventOptions.id === options.id){
                    this.optionsStacked.splice(this.optionsStacked.indexOf(eventOptions), 1);
                }
            }
            if(!this.checkEventsOnThisDate(options.date)) {
                this.delDate(options.date)
            }

        }

        renderEvents() {
            this.container.find('.event').remove();
            for (let event of this.optionsStacked){
                this.event[event.id] = new Event(event);
                this.container.find(`#${event.date}`).find('.card').append(this.event[event.id].getContainer())
            }
        }

        renderDate() {
            this.container.find('.event-day').remove();
            for (let date of this.datesWithEvents){
                this.container.find('.dates-wrapper').append($(
                    '<div>', {
                        class: 'event-day col-md-4',
                        id: date,
                        html:
                            $('<div>',{
                                class:'card',
                                html:
                                    $('<div>', {class:'date',text: date}).get(0).outerHTML +
                                    $('<div>', {class: 'eventsContainer'}).get(0).outerHTML
                            })
                    })
                )
            }

            this.renderEvents();
            if (this.datesWithEvents.length !== 0){
                this.container.find('.events-stacked').css('display', 'block');
            } else {
                this.container.find('.events-stacked').css('display', 'none');
            }
            if (this.datesWithEvents.length > 3){
                this.container.find('#date-list-get-prev').show();
                this.container.find('#date-list-get-next').show();
            } else {
                this.container.find('#date-list-get-prev').hide();
                this.container.find('#date-list-get-next').hide();
            }
        }
        getContainer (){
            return this.container
        }
    }

    new Page();
});
