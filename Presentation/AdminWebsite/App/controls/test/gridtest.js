﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  define(function(require) {
    var ViewModel, availableBrands, i18n, nav, shell;
    require("controls/grid");
    shell = require("shell");
    nav = require("nav");
    i18n = require("i18next");
    availableBrands = ko.computed(function() {
      var brands;
      brands = shell.brands();
      brands.shift();
      return brands;
    });
    return ViewModel = (function() {
      function ViewModel() {
        this.shell = shell;
        this.bonusId = ko.observable();
        this.bonusRemarks = ko.observable();
        this.isBonusActive = ko.observable(false);
        this.search = ko.observable("");
        this.compositionComplete = (function(_this) {
          return function() {
            return $(function() {
              $("#bonus-grid").on("gridLoad selectionChange", function(e, row) {
                _this.bonusId(row.id);
                _this.isBonusActive(row.data.IsActive === "Active");
                return _this.bonusRemarks(row.data.Remarks);
              });
              return $("#bonus-search").submit(function() {
                _this.search($('#name-search').val());
                return false;
              });
            });
          };
        })(this);
      }

      ViewModel.prototype.typeFormatter = function() {
        return i18n.t("app:bonus.bonusTypes." + (this.IsFirstDeposit && this.Type === 0 ? "FirstDeposit" : this.Type));
      };

      ViewModel.prototype.brandFormatter = function() {
        var brand;
        brand = ko.utils.arrayFirst(availableBrands(), (function(_this) {
          return function(brand) {
            return brand.id() === _this.BrandId;
          };
        })(this));
        return brand != null ? brand.name() : void 0;
      };

      ViewModel.prototype.statusFormatter = function() {
        return i18n.t("app:bonus.status." + this.IsActive);
      };

      ViewModel.prototype.openAddBonusTab = function() {
        return nav.open({
          path: "bonus/bonus-manager/add-bonus",
          title: i18n.t("app:bonus.bonusManager.new")
        });
      };

      ViewModel.prototype.openEditBonusTab = function() {
        if (this.bonusId()) {
          return nav.open({
            path: "bonus/bonus-manager/edit-bonus",
            title: i18n.t("app:bonus.bonusManager.edit"),
            data: {
              id: this.bonusId()
            }
          });
        }
      };

      ViewModel.prototype.openViewBonusTab = function() {
        if (this.bonusId()) {
          return nav.open({
            path: "bonus/bonus-manager/view-bonus",
            title: i18n.t("app:bonus.bonusManager.view"),
            data: {
              id: this.bonusId()
            }
          });
        }
      };

      ViewModel.prototype.showModalDialog = function(isActive) {
        var BonusModal;
        BonusModal = require("bonus/bonus-manager/bonus-status-dialog");
        console.log(this);
        return new BonusModal(isActive, this.bonusRemarks()).show().then((function(_this) {
          return function(dialogResult) {
            if (!dialogResult.isCancel) {
              return $.post("/Bonus/ChangeBonusStatus", {
                id: _this.bonusId(),
                isActive: isActive,
                remarks: dialogResult.remarks
              }).done(function(data) {
                if (data.Success) {
                  return $("#bonus-grid").trigger("reload");
                }
              });
            }
          };
        })(this));
      };

      return ViewModel;

    })();
  });

}).call(this);
