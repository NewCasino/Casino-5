﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var IdentitySettingsRemarksDialog, ViewModel, i18N, jgu, nav, security;
    require("controls/grid");
    nav = require("nav");
    i18N = require("i18next");
    jgu = require("JqGridUtil");
    security = require("security/security");
    IdentitySettingsRemarksDialog = require("admin/identification-document-settings/remarks-dialog/remarks-dialog");
    return ViewModel = (function(_super) {
      __extends(ViewModel, _super);

      function ViewModel() {
        ViewModel.__super__.constructor.apply(this, arguments);
        this.selectedRowId = ko.observable();
        this.isViewAllowed = ko.observable(security.isOperationAllowed(security.permissions.view, security.categories.identificationDocumentSettings));
        this.isAddAllowed = ko.observable(security.isOperationAllowed(security.permissions.create, security.categories.identificationDocumentSettings));
        this.isEditAllowed = ko.observable(security.isOperationAllowed(security.permissions.update, security.categories.identificationDocumentSettings));
      }

      ViewModel.prototype.openViewTab = function() {
        return nav.open({
          path: "admin/identification-document-settings/edit",
          title: i18N.t("View"),
          data: {
            id: this.rowId() != null ? this.rowId() : void 0,
            submitted: true
          }
        });
      };

      ViewModel.prototype.openAddTab = function() {
        return nav.open({
          path: "admin/identification-document-settings/add",
          title: i18N.t("New")
        });
      };

      ViewModel.prototype.openEditTab = function() {
        return nav.open({
          path: "admin/identification-document-settings/edit",
          title: i18N.t("Edit"),
          data: this.rowId() != null ? {
            id: this.rowId()
          } : void 0
        });
      };

      ViewModel.prototype.attached = function(view) {
        var $grid, self;
        self = this;
        $grid = findGrid(view);
        $("form", view).submit(function() {
          $grid.trigger("reload");
          return false;
        });
        $grid.on("gridLoad selectionChange", (function(_this) {
          return function(e, row) {
            _this.rowId(row.id);
            return _this.rowChange(row);
          };
        })(this));
        return $(view).on("click", ".identity-settings-remark", function() {
          var id, remark;
          id = $(this).parents("tr").first().attr("id");
          remark = $(this).attr("title");
          return (new IdentitySettingsRemarksDialog(id, remark)).show(function() {
            return $grid.trigger("reload");
          });
        });
      };

      return ViewModel;

    })(require("vmGrid"));
  });

}).call(this);
