﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(reguire) {
    var ActivateDialog, activateTemplateModel, baseModel, dialog, i18n;
    dialog = require("plugins/dialog");
    i18n = require("i18next");
    baseModel = require("base/base-view-model");
    activateTemplateModel = require("messaging/message-templates/models/activate-template-model");
    return ActivateDialog = (function(_super) {
      __extends(ActivateDialog, _super);

      function ActivateDialog(id, remarks) {
        ActivateDialog.__super__.constructor.apply(this, arguments);
        this.SavePath = "/MessageTemplate/Activate";
        this.Model = new activateTemplateModel();
        this.Model.id(id);
        this.Model.remarks(remarks);
        this.Model.remarks.isModified(false);
      }

      ActivateDialog.prototype.handleSaveFailure = function(response) {
        var error, field, fields, _i, _len, _results;
        fields = response != null ? response.fields : void 0;
        if (fields != null) {
          _results = [];
          for (_i = 0, _len = fields.length; _i < _len; _i++) {
            field = fields[_i];
            error = field.errors[0];
            _results.push(this.setError(this.Model[field.name], i18n.t("app:messageTemplates.validation." + error)));
          }
          return _results;
        }
      };

      ActivateDialog.prototype.onsave = function() {
        $(document).trigger("message_template_changed");
        return dialog.close(this);
      };

      ActivateDialog.prototype.cancel = function() {
        return dialog.close(this);
      };

      ActivateDialog.prototype.clear = function() {
        this.Model.remarks("");
        return this.Model.remarks.isModified(false);
      };

      ActivateDialog.prototype.show = function() {
        return dialog.show(this);
      };

      return ActivateDialog;

    })(baseModel);
  });

}).call(this);
