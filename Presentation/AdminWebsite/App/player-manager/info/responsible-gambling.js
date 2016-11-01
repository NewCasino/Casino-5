﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var Dialog, ViewModel, config, dateFormat, efu, moment;
    require("controls/grid");
    config = require("config");
    efu = require("EntityFormUtil");
    moment = require("moment");
    Dialog = require("controls/confirmation-dialog/confirm-dialog");
    dateFormat = 'YYYY/MM/DD HH:mm:ss Z';
    return ViewModel = (function() {
      function ViewModel() {
        this.activate = __bind(this.activate, this);
        this.update = __bind(this.update, this);
        this.isLoading = false;
        this.playerId = ko.observable();
        this.timeZoneOffset = ko.observable();
        this.submitted = ko.observable();
        this.message = ko.observable();
        this.messageClass = ko.observable();
        this.isTimeOutEnabled = ko.observable(false);
        this.isTimeOutEnabled.subscribe((function(_this) {
          return function(value) {
            if (value && !_this.isLoading) {
              _this.isSelfExclusionEnabled(false);
              return _this.timeOutStartDate(moment(new Date()).zone(_this.timeZoneOffset).format(dateFormat));
            }
          };
        })(this));
        this.timeOut = ko.observable();
        this.timeOut.subscribe((function(_this) {
          return function(val) {
            if (_this.isTimeOutEnabled()) {
              return _this.timeOutStartDate(moment(new Date()).zone(_this.timeZoneOffset).format(dateFormat));
            }
          };
        })(this));
        this.timeOuts = ko.observable([
          {
            id: 0,
            name: '24 hrs'
          }, {
            id: 1,
            name: '1 week'
          }, {
            id: 2,
            name: '1 month'
          }, {
            id: 3,
            name: '6 weeks'
          }
        ]);
        this.timeOutStartDate = ko.observable();
        this.timeOutStartDate.subscribe((function(_this) {
          return function(val) {
            if (val && !_this.isLoading) {
              return $.get("ResponsibleGambling/GetTimeOutEndDate", {
                timeOutType: _this.timeOut(),
                startDate: val
              }).done(function(date) {
                return _this.timeOutEndDate(moment(date).zone(_this.timeZoneOffset).format(dateFormat));
              });
            }
          };
        })(this));
        this.timeOutEndDate = ko.observable();
        this.isSelfExclusionEnabled = ko.observable(false);
        this.isSelfExclusionEnabled.subscribe((function(_this) {
          return function(value) {
            if (value && !_this.isLoading) {
              _this.isTimeOutEnabled(false);
              return _this.selfExclusionStartDate(moment(new Date()).zone(_this.timeZoneOffset).format(dateFormat));
            }
          };
        })(this));
        this.selfExclusion = ko.observable();
        this.selfExclusion.subscribe((function(_this) {
          return function(val) {
            if (_this.isSelfExclusionEnabled()) {
              return _this.selfExclusionStartDate(moment(new Date()).zone(_this.timeZoneOffset).format(dateFormat));
            }
          };
        })(this));
        this.selfExclusions = ko.observable([
          {
            id: 0,
            name: '6 months'
          }, {
            id: 1,
            name: '1 year'
          }, {
            id: 2,
            name: '5 years'
          }, {
            id: 3,
            name: 'permanent'
          }
        ]);
        this.selfExclusionStartDate = ko.observable();
        this.selfExclusionStartDate.subscribe((function(_this) {
          return function(val) {
            if (val && !_this.isLoading) {
              return $.get("ResponsibleGambling/GetSelfExclusionEndDate", {
                exclusionType: _this.selfExclusion(),
                startDate: val
              }).done(function(date) {
                return _this.selfExclusionEndDate(moment(date).zone(_this.timeZoneOffset).format(dateFormat));
              });
            }
          };
        })(this));
        this.selfExclusionEndDate = ko.observable();
      }

      ViewModel.prototype.update = function() {
        var confirm;
        this.message('');
        confirm = new Dialog({
          caption: 'Player Manager',
          question: 'Are you sure you want self exclude the player?',
          yesAction: (function(_this) {
            return function() {
              return $.post("ResponsibleGambling/UpdateSelfExclusion", {
                playerId: _this.playerId(),
                isTimeOutEnabled: _this.isTimeOutEnabled(),
                timeOut: _this.timeOut(),
                timeOutStartDate: _this.timeOutStartDate(),
                isSelfExclusionEnabled: _this.isSelfExclusionEnabled(),
                selfExclusion: _this.selfExclusion(),
                selfExclusionStartDate: _this.selfExclusionStartDate()
              }).done(function(response) {
                if (response.result === 'success') {
                  _this.message('Account has been successfully self-excluded.');
                  return _this.messageClass('alert-success');
                } else {
                  _this.message('Fail.');
                  return _this.messageClass('alert-danger');
                }
              });
            };
          })(this)
        });
        return confirm.show();
      };

      ViewModel.prototype.activate = function(data) {
        this.playerId(data.playerId);
        return $.get("ResponsibleGambling/GetData", {
          playerId: this.playerId()
        }).done((function(_this) {
          return function(response) {
            if (response) {
              _this.isLoading = true;
              _this.timeZoneOffset = response.timeZoneOffset;
              _this.timeOut(response.timeOut);
              _this.isTimeOutEnabled(response.isTimeOutEnabled);
              if (response.timeOutStartDate) {
                _this.timeOutStartDate(moment(response.timeOutStartDate).zone(_this.timeZoneOffset).format(dateFormat));
              } else {
                _this.timeOutStartDate(moment(new Date()).zone(_this.timeZoneOffset).format(dateFormat));
              }
              _this.timeOutEndDate(moment(response.timeOutEndDate).zone(_this.timeZoneOffset).format(dateFormat));
              _this.selfExclusion(response.selfExclusion);
              _this.isSelfExclusionEnabled(response.isSelfExclusionEnabled);
              if (response.selfExclusionStartDate) {
                _this.selfExclusionStartDate(moment(response.selfExclusionStartDate).zone(_this.timeZoneOffset).format(dateFormat));
              } else {
                _this.selfExclusionStartDate(moment(new Date()).zone(_this.timeZoneOffset).format(dateFormat));
              }
              _this.selfExclusionEndDate(moment(response.selfExclusionEndDate).zone(_this.timeZoneOffset).format(dateFormat));
              return _this.isLoading = false;
            }
          };
        })(this));
      };

      return ViewModel;

    })();
  });

}).call(this);
