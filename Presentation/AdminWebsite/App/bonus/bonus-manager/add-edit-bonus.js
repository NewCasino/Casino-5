﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./bonusBase", "bonus/bonusCommon", "komapping", "nav", "config", "i18next", "dateBinders"], function(bonusBase, common, mapping, nav, config, i18N) {
    var AddEditBonusModel;
    return AddEditBonusModel = (function(_super) {
      __extends(AddEditBonusModel, _super);

      function AddEditBonusModel() {
        this.detached = __bind(this.detached, this);
        this.activate = __bind(this.activate, this);
        this.processResponse = __bind(this.processResponse, this);
        this.submit = __bind(this.submit, this);
        this.getBrandField = __bind(this.getBrandField, this);
        AddEditBonusModel.__super__.constructor.call(this);
        this.ActiveTo.subscribe((function(_this) {
          return function() {
            return _this.ActiveTo.isModified(false);
          };
        })(this));
        this.vLicenseeName = ko.computed((function(_this) {
          return function() {
            return _this.getBrandField("LicenseeName");
          };
        })(this));
        this.vBrandName = ko.computed((function(_this) {
          return function() {
            return _this.getBrandField("BrandName");
          };
        })(this));
        this.vRequireBonusCode = ko.computed((function(_this) {
          return function() {
            var thisTemplate;
            thisTemplate = ko.utils.arrayFirst(_this.templates(), function(template) {
              return template.Id === _this.TemplateId();
            });
            return thisTemplate != null ? thisTemplate.RequireBonusCode : void 0;
          };
        })(this));
        this.Code.extend({
          required: {
            params: true,
            message: i18N.t("common.requiredField"),
            onlyIf: this.vRequireBonusCode
          }
        });
      }

      AddEditBonusModel.prototype.getBrandField = function(fieldName) {
        var thisTemplate;
        thisTemplate = ko.utils.arrayFirst(this.templates(), (function(_this) {
          return function(template) {
            return template.Id === _this.TemplateId();
          };
        })(this));
        if (thisTemplate != null) {
          return thisTemplate[fieldName];
        } else {
          return this.emptyCaption();
        }
      };

      AddEditBonusModel.prototype.submit = function() {
        var objectToSend;
        if (this.isValid()) {
          objectToSend = JSON.parse(mapping.toJSON(this, {
            ignore: common.getIgnoredFieldNames(this)
          }));
          return $.ajax({
            type: "POST",
            url: config.adminApi("Bonus/CreateUpdate"),
            data: ko.toJSON(objectToSend),
            dataType: "json",
            contentType: "application/json"
          }).done((function(_this) {
            return function(response) {
              return _this.processResponse(response);
            };
          })(this));
        } else {
          return this.errors.showAllMessages();
        }
      };

      AddEditBonusModel.prototype.processResponse = function(response) {
        var obj;
        if (response.Success) {
          this.cancel();
          $(document).trigger("bonuses_changed");
          obj = {
            id: response.BonusId
          };
          obj[this.Id() === void 0 ? "created" : "edited"] = true;
          return nav.open({
            path: "bonus/bonus-manager/view-bonus",
            title: i18N.t("bonus.bonusManager.view"),
            data: obj
          });
        } else {
          response.Errors.forEach((function(_this) {
            return function(element) {
              if (element.PropertyName === "Bonus") {
                return _this.serverErrors([element.ErrorMessage]);
              } else {
                return setError(_this[element.PropertyName], element.ErrorMessage);
              }
            };
          })(this));
          return this.errors.showAllMessages();
        }
      };

      AddEditBonusModel.prototype.activate = function(input) {
        $(document).on("bonus_templates_changed", this.reloadTemplates);
        return $.get(config.adminApi("Bonus/GetRelatedData"), {
          id: input != null ? input.id : void 0
        }).done((function(_this) {
          return function(response) {
            _this.templates(response.Templates);
            if (input != null) {
              mapping.fromJS(response.Bonus, {}, _this);
              return _this.TemplateId.valueHasMutated();
            }
          };
        })(this));
      };

      AddEditBonusModel.prototype.detached = function() {
        return $(document).off("bonuses_changed", this.reloadTemplates);
      };

      return AddEditBonusModel;

    })(bonusBase);
  });

}).call(this);
