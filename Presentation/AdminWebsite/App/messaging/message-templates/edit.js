﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var EditViewModel, aceEditor, baseModel, editTemplateModel, i18n, nav;
    nav = require("nav");
    i18n = require("i18next");
    baseModel = require("base/base-view-model");
    editTemplateModel = require("messaging/message-templates/models/edit-template-model");
    aceEditor = require("ace-editor");
    return EditViewModel = (function(_super) {
      __extends(EditViewModel, _super);

      function EditViewModel() {
        this.activate = __bind(this.activate, this);
        EditViewModel.__super__.constructor.apply(this, arguments);
        this.SavePath = "/MessageTemplate/Edit";
        this.Model = new editTemplateModel();
      }

      EditViewModel.prototype.handleSaveFailure = function(response) {
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

      EditViewModel.prototype.onsave = function() {
        $(document).trigger("message_template_changed");
        nav.close();
        return nav.open({
          path: "messaging/message-templates/view",
          title: i18n.t("app:common.view"),
          data: {
            id: this.Model.id()
          }
        });
      };

      EditViewModel.prototype.activate = function(data) {
        EditViewModel.__super__.activate.apply(this, arguments);
        return $.get("/MessageTemplate/Edit?id=" + data.id).done((function(_this) {
          return function(response) {
            _this.Model.id(data.id);
            _this.Model.licenseeName(response.licenseeName);
            _this.Model.brandName(response.brandName);
            _this.Model.languageName(response.languageName);
            _this.Model.messageType(response.messageType);
            _this.Model.messageDeliveryMethod(response.messageDeliveryMethod);
            _this.Model.templateName(response.templateName);
            _this.Model.subject(response.subject);
            _this.Model.messageContent(response.messageContent);
            _this.subjectEditorId = "edit-template-subject-" + data.id;
            return _this.messageEditorId = "edit-template-message-" + data.id;
          };
        })(this));
      };

      EditViewModel.prototype.compositionComplete = function() {
        new aceEditor(this.subjectEditorId, this.Model.subject, true, true);
        return new aceEditor(this.messageEditorId, this.Model.messageContent, true, false);
      };

      return EditViewModel;

    })(baseModel);
  });

}).call(this);