﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var Casino, model;

  Casino = (function() {
    Casino.prototype.page = 1;

    function Casino() {
      var self;
      self = this;
      this.loadMore = function() {
        alert('wait for api load more games');
        return false;
        return $.get('api/url').done((function(_this) {
          return function(response) {
            console.log('games load');
            return self.page = self.page + 1;
          };
        })(this)).fail((function(_this) {
          return function(jqXHR) {
            return _this.onLoadFail(JSON.parse(jqXHR.responseText));
          };
        })(this));
      };
      this.onLoadFail = (function(_this) {
        return function(response) {
          var error, message;
          message = '';
          if (IsJsonString(response.message)) {
            error = JSON.parse(response.message);
            return message = i18n.t(error.text, error.variables);
          } else {
            return message = i18n.t(response.message);
          }
        };
      })(this);
    }

    return Casino;

  })();

  model = new Casino;

  ko.applyBindings(model, $("#casino-wrapper")[0]);

}).call(this);