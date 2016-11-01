﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var ViewModel, app, baseViewModel, config, contentTranslationModel, i18n, mapping, nav, reloadGrid, security, showMessage, toastr;
    nav = require("nav");
    app = require("durandal/app");
    i18n = require("i18next");
    mapping = require("komapping");
    toastr = require("toastr");
    baseViewModel = require("base/base-view-model");
    contentTranslationModel = require("brand/translation-manager/model/add-content-translation-model");
    security = require("security/security");
    config = require("config");
    reloadGrid = function() {
      return $('#translation-grid').trigger("reload");
    };
    showMessage = function(message) {
      return app.showMessage(message, i18n.t("app:contenttranslation.messages.validationError", [i18n.t('common.close')], false, {
        style: {
          width: "350px"
        }
      }));
    };
    ViewModel = (function(_super) {
      __extends(ViewModel, _super);

      function ViewModel() {
        this.activate = __bind(this.activate, this);
        ViewModel.__super__.constructor.apply(this, arguments);
        this.SavePath = config.adminApi("ContentTranslation/CreateContentTranslation");
        this.contentType("application/json");
        jQuery.ajaxSettings.traditional = true;
        this.translationId = ko.observable();
        this.language = ko.observable();
        this.language.subscribe((function(_this) {
          return function(lang) {
            var tr;
            return _this.translation(((function() {
              var _i, _len, _ref, _results;
              _ref = this.Model.translations();
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                tr = _ref[_i];
                if (tr.language === lang) {
                  _results.push(tr.translation);
                }
              }
              return _results;
            }).call(_this))[0]);
          };
        })(this));
        this.translation = ko.observable().extend({
          required: true,
          minLength: 1,
          maxLength: 200
        });
        this.isTranslationAdded = ko.computed((function(_this) {
          return function() {
            var languages, translations, _ref, _ref1, _ref2, _ref3;
            languages = (_ref = _this.Model) != null ? _ref.translations().map(function(l) {
              return l.language;
            }) : void 0;
            translations = (_ref1 = _this.Model) != null ? _ref1.translations().map(function(l) {
              return l.translation;
            }) : void 0;
            console.log(languages);
            console.log(translations);
            return (languages != null) && (translations != null) && (_ref2 = _this.language(), __indexOf.call(languages, _ref2) >= 0) && (_ref3 = _this.translation(), __indexOf.call(translations, _ref3) >= 0);
          };
        })(this));
        this.addBtnText = ko.computed((function(_this) {
          return function() {
            var added, languages, translations, _ref, _ref1, _ref2, _ref3;
            languages = (_ref = _this.Model) != null ? _ref.translations().map(function(l) {
              return l.language;
            }) : void 0;
            translations = (_ref1 = _this.Model) != null ? _ref1.translations().map(function(l) {
              return l.translation;
            }) : void 0;
            console.log(languages);
            console.log(translations);
            console.log(_this.language());
            console.log(_this.translation());
            added = (languages != null) && (translations != null) && (_ref2 = _this.language(), __indexOf.call(languages, _ref2) >= 0) && (_ref3 = _this.translation(), __indexOf.call(translations, _ref3) >= 0);
            if (added) {
              return i18n.t("app:common.edit");
            } else {
              return i18n.t("app:common.add");
            }
          };
        })(this));
        this.compositionComplete = (function(_this) {
          return function() {
            return $(function() {
              return $("#add-translations-grid").on("gridLoad selectionChange", function(e, row) {
                _this.translationId(row.id);
                _this.language(row.data.language);
                return _this.translation(row.data.translation);
              });
            });
          };
        })(this);
      }

      ViewModel.prototype.onsave = function(data) {
        reloadGrid();
        this.success(i18n.t("app:contenttranslation.messages.translationSuccessfullyCreated"));
        nav.title(i18n.t("app:contenttranslation.viewTranslation"));
        return this.readOnly(true);
      };

      ViewModel.prototype.onfail = function(data) {
        return showMessage(data.data);
      };

      ViewModel.prototype.clear = function() {
        return ViewModel.__super__.clear.apply(this, arguments);
      };

      ViewModel.prototype.addTranslation = function() {
        var currentTranslation, tr;
        if (!this.translation.isValid()) {
          showMessage("Translation is required");
          return;
        }
        currentTranslation = ((function() {
          var _i, _len, _ref, _results;
          _ref = this.Model.translations();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            tr = _ref[_i];
            if (tr.language === this.language()) {
              _results.push(tr);
            }
          }
          return _results;
        }).call(this))[0];
        if (currentTranslation != null) {
          currentTranslation.translation = this.translation();
          tr = this.translation();
          this.Model.translations.valueHasMutated();
          return this.translation(tr);
        } else {
          tr = this.translation();
          this.Model.translations.push({
            language: this.language(),
            translation: tr
          });
          return this.translation(tr);
        }
      };

      ViewModel.prototype.deleteTranslation = function() {
        return this.Model.translations.remove(this.Model.translations()[this.translationId() - 1]);
      };

      ViewModel.prototype.activate = function() {
        ViewModel.__super__.activate.apply(this, arguments);
        this.Model = new contentTranslationModel();
        this.language(null);
        this.translation(null);
        return $.get(config.adminApi("ContentTranslation/GetContentTranslationAddData")).done((function(_this) {
          return function(response) {
            return _this.Model.languages(response.languages);
          };
        })(this));
      };

      return ViewModel;

    })(baseViewModel);
    return new ViewModel();
  });

}).call(this);