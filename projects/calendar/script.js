$(function () {
    const versions = {
        PROTOTYPE() {},

        ES5() {},

        ES6() {
            class CalendarPage {
                constructor() {
                    this.container = $('.container');
                    this.container.append(this._bindStructure());
                    this.calendarsContainer = this.container.find('.calendars-container');
                    this.nameInputElement = this.container.find('.name-cal');
                    this.btnAddCalendar = this.container.find('.add-cal');

                    this._bindEvent();
                }

                _bindStructure() {
                    return $('<form>', {
                        class: 'add-container',
                        html:
                            $('<input>', { type: 'text', class: 'name-cal' }).get(0).outerHTML +
                            $('<input>', { type: 'button', class: 'add-cal', value: '+', disabled: true }).get(0).outerHTML +
                            $('<div>', { class: 'calendars-container'}).get(0).outerHTML
                    });
                }

                _bindEvent() {
                    this.btnAddCalendar.on('click', () => {
                        this._addCalendar();
                    });

                    this.nameInputElement.on('keyup', (e) => {
                         this.btnAddCalendar.prop('disabled', !this.nameInputElement.val().trim());
                        if(e.code === 13) {
                            this._addCalendar();
                        }
                    })
                }

                _addCalendar() {
                    const calendar = new Calendar({
                        name: this.nameInputElement.val().trim()
                    });
                    this.calendarsContainer.append(calendar.structure);
                    this.nameInputElement.val('');
                    this.btnAddCalendar.prop('disabled', true);
                }
            }

            class Calendar {
                monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                weekDays = ["Mon", "Tue", "Wed","Thu","Fri","Sat","Sun"];

               constructor(calendar) {
                   this.currentDate = this._getCurrentDate();
                   this.structure = this._bindStructure(calendar);
               }

               _bindStructure(calendar) {
                   const generateWeek = weekDays => weekDays.map(text => $('<li>', { text }).get(0).outerHTML).join('');
                   const generateDays = () => '';

                   return $('<div>', {
                       class: 'calendar',
                       html:
                           $('<h3>', { text: calendar.name }).get(0).outerHTML +
                           $('<div>', {
                               class: 'calendar-control',
                               html:
                                   $('<button>', { class: 'left', text: '<' }).get(0).outerHTML +
                                   $('<span>', { text: this.currentDate.month }).get(0).outerHTML +
                                   $('<button>', { class: 'right', text: '>' }).get(0).outerHTML
                           }).get(0).outerHTML +
                           $('<ul>', {
                               class: 'days',
                               html: generateWeek(this.weekDays)
                           }).get(0).outerHTML +
                           $('<ul>', {
                               class: 'date',
                               html: generateDays()
                           }).get(0).outerHTML +
                           $('<input>', { class: 'result', type: 'text' }).get(0).outerHTML +
                           $('<input>', { class: 'format', type: 'text' }).get(0).outerHTML
                   });
               }

               _getCurrentDate() {
                   const date = new Date();

                   return {
                       month: this.monthNames[date.getMonth()],
                   }
               }

               _bindEvents() {

               }

               _delCalendar() {

               }
            }

            new CalendarPage();

        },

        RAW() {
            function Calendar() {
                this.date = new Date();
                this.month = this.date.getMonth();
                this.year = this.date.getFullYear();
                this.init()

            }

            Calendar.prototype = {
                init(){
                    this.container =$('#calendar');
                    this.table = this.container.find('tbody');
                    this.addCalendarToView();
                    console.log(this.month)
                },

                addCalendarToView (){
                    for (var i = 0; i < this.date.getDay(); i++) {
                        const placebo = $('<td>');
                        placebo.appendTo(this.table)
                    }

                    while (this.date.getMonth() === this.month) {
                        const dateCell =$( '<td>', { text: this.date.getDate() } );
                        dateCell.appendTo(this.table);

                        if (this.date.getDay() % 7 == 6) { // вс, последний день - перевод строки
                            this.table.append('<tr>');
                        }

                        this.date.setDate(this.date.getDate() + 1);
                    }

                    // добить таблицу пустыми ячейками, если нужно
                    if (getDay(this.date) != 0) {
                        for (var i = getDay(d); i < 7; i++) {
                            table += '<td></td>';
                        }
                    }
                }
            };

            new Calendar()
        },
    };

    versions.ES6();
});
