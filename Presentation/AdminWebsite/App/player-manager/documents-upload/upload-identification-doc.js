﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var ViewModel, config, i18N, mapping, moment, nav, picker;
    nav = require("nav");
    mapping = require("komapping");
    i18N = require("i18next");
    picker = require("datePicker");
    config = require("config");
    moment = require("moment");
    ViewModel = (function() {
      function ViewModel() {
        this.forceValidation = __bind(this.forceValidation, this);
        this.initializeViewModel();
      }

      ViewModel.prototype.initializeViewModel = function() {
        var defaultImagePreviewSrc;
        this.SavePath = config.adminApi("PlayerInfo/UploadId");
        this.playerId = ko.observable();
        this.message = ko.observable();
        this.messageClass = ko.observable();
        this.submitted = ko.observable();
        this.licensee = ko.observable().extend({
          required: true
        });
        this.brand = ko.observable().extend({
          required: true
        });
        this.documentType = ko.observable().extend({
          required: true
        });
        this.username = ko.observable();
        this.documentTypes = ko.observableArray();
        this.isIdOrCredit = ko.computed((function(_this) {
          return function() {
            return _this.documentType() === "Id" || _this.documentType() === "CreditCard";
          };
        })(this));
        this.firstFileUploaderLabel = ko.computed((function(_this) {
          return function() {
            if (_this.isIdOrCredit) {
              return i18N.t("playerManager.identificationDocuments.labels.idFrontUpload");
            }
            return "Upload Document";
          };
        })(this));
        this.cardNumber = ko.observable().extend({
          required: {
            onlyIf: this.isIdOrCredit
          },
          minLength: 1,
          maxLength: 20,
          pattern: {
            message: i18N.t("app:common.validationMessages.onlyNumeric").replace("__fieldName__", i18N.t("app:playerManager.identificationDocuments.labels.cardNumber")),
            params: '^[0-9]+$'
          }
        });
        this.cardExpirationDate = ko.observable();
        this.cardExpirationDate.extend({
          required: {
            onlyIf: this.isIdOrCredit
          },
          validation: {
            validator: (function(_this) {
              return function(val, isIdOrCredit) {
                if (_this.isIdOrCredit()) {
                  return moment().diff(val) < 0;
                }
                return true;
              };
            })(this),
            message: 'Expiration Date is not valid.',
            params: this.isIdOrCredit
          }
        });
        this.uploadId1FieldId = ko.observable("deposit-confirm-upload-id-1");
        this.uploadId2FieldId = ko.observable("deposit-confirm-upload-id-2");
        defaultImagePreviewSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjE1MCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjE5cHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+MzAweDIwMDwvdGV4dD48L3N2Zz4=";
        this.uploadId1Src = ko.observable(defaultImagePreviewSrc);
        this.uploadId2Src = ko.observable(defaultImagePreviewSrc);
        this.maxSize = 4194304;
        this.idFrontImage = ko.observable().extend({
          required: true,
          validation: {
            validator: (function(_this) {
              return function(val) {
                var element, file;
                element = $('input#' + _this.uploadId1FieldId())[0];
                file = element ? element.files[0] : void 0;
                return file && (file.size <= _this.maxSize);
              };
            })(this),
            message: 'Maximum file size is 4Mb.'
          }
        });
        this.idBackImage = ko.observable().extend({
          validation: [
            {
              validator: (function(_this) {
                return function(val) {
                  var element, file;
                  element = $('input#' + _this.uploadId2FieldId())[0];
                  file = element ? element.files[0] : void 0;
                  if (file === void 0) {
                    return true;
                  }
                  return file.size <= _this.maxSize;
                };
              })(this),
              message: 'Maximum file size is 4Mb.'
            }, {
              validator: (function(_this) {
                return function(val, isIdOrCredit) {
                  var element, file;
                  if (isIdOrCredit()) {
                    element = $('input#' + _this.uploadId2FieldId())[0];
                    file = element ? element.files[0] : void 0;
                    if (file === void 0) {
                      return false;
                    }
                    true;
                  }
                  return true;
                };
              })(this),
              message: 'Both sides of the documents should be uploaded.',
              params: this.isIdOrCredit
            }
          ]
        });
        this.remarks = ko.observable().extend({
          maxLength: 200
        });
        return this.errors = ko.validation.group(this);
      };

      ViewModel.prototype.compositionComplete = function(data) {
        $('input#' + this.uploadId1FieldId()).ace_file_input(this.makeFileInputSettings(this.idFrontImage));
        return $('input#' + this.uploadId2FieldId()).ace_file_input(this.makeFileInputSettings(this.idBackImage));
      };

      ViewModel.prototype.makeFileInputSettings = function(resetOb) {
        return {
          style: 'well',
          btn_choose: "Drop image or click to choose",
          no_file: 'No File ...',
          droppable: true,
          thumbnail: 'fit',
          before_change: function(files, dropped) {
            var file, type;
            file = files[0];
            if (typeof file === "string") {
              if (!/\.(jpe?g|png|gif)$/i.test(file)) {
                resetOb("");
                alert(i18N.t("app:payment.deposit.pleaseSelectImage"));
                -1;
              }
            } else {
              type = $.trim(file.type);
              if ((type.length > 0 && !/^image\/(jpe?g|png|gif)$/i.test(type)) || (type.length === 0 && !/\.(jpe?g|png|gif)$/i.test(file.name))) {
                resetOb("");
                alert(i18N.t("app:payment.deposit.pleaseSelectImage"));
                -1;
              }
            }
            return true;
          }
        };
      };

      ViewModel.prototype.showError = function(msg) {
        this.message(msg);
        return this.messageClass('alert alert-danger');
      };

      ViewModel.prototype.showMessage = function(msg) {
        this.message(msg);
        return this.messageClass('alert alert-success');
      };

      ViewModel.prototype.clearMessage = function() {
        this.message('');
        return this.messageClass('');
      };

      ViewModel.prototype.cancel = function() {
        return nav.close();
      };

      ViewModel.prototype.clear = function() {
        this.clearMessage();
        this.licensee('');
        this.licensee.isModified(false);
        this.brand('');
        this.brand.isModified(false);
        this.documentType('');
        this.documentType.isModified(false);
        this.cardNumber('');
        this.cardNumber.isModified(false);
        this.cardExpirationDate('');
        this.cardExpirationDate.isModified(false);
        this.idFrontImage('');
        this.idFrontImage.isModified(false);
        this.idBackImage('');
        this.idBackImage.isModified(false);
        this.remarks('');
        return this.remarks.isModified(false);
      };

      ViewModel.prototype.activate = function(data) {
        this.playerId(data.playerId);
        this.clear();
        this.submitted(false);
        return this.load();
      };

      ViewModel.prototype.load = function() {
        return $.get(config.adminApi("PlayerInfo/GetIdentificationDocumentEditData?id=" + this.playerId())).done((function(_this) {
          return function(data) {
            _this.licensee(data.licenseeName);
            _this.brand(data.brandName);
            _this.username(data.username);
            return _this.documentTypes(data.documentTypes);
          };
        })(this));
      };

      ViewModel.prototype.forceValidation = function() {
        this.idBackImage(this.idBackImage());
        return this.idFrontImage(this.idFrontImage());
      };

      ViewModel.prototype.save = function() {
        var fd, model;
        this.clearMessage();
        this.forceValidation();
        if (this.isValid()) {
          model = {
            documentType: this.documentType(),
            cardNumber: this.cardNumber(),
            cardExpirationDate: this.cardExpirationDate(),
            remarks: this.remarks()
          };
          fd = new FormData();
          fd.append('uploadId1', $('input#' + this.uploadId1FieldId())[0].files[0]);
          fd.append('uploadId2', $('input#' + this.uploadId2FieldId())[0].files[0]);
          fd.append('data', JSON.stringify(model));
          fd.append('playerId', this.playerId());
          return $.ajax({
            type: "POST",
            url: this.SavePath,
            data: fd,
            processData: false,
            contentType: false,
            xhr: (function(_this) {
              return function() {
                var req;
                req = new XMLHttpRequest();
                req.onreadystatechange = function(e) {
                  var response;
                  if (4 === req.readyState) {
                    response = JSON.parse(req.responseText);
                    if (response.result === "failed") {
                      _this.showError(response.data);
                    } else {
                      $('#id-documents-grid').trigger('reload');
                      if (response.data.frontIdFilename) {
                        _this.uploadId1Src('image/Show?fileId=' + response.data.frontIdFilename + '&playerId=' + _this.playerId());
                      }
                      if (response.data.backIdFilename) {
                        _this.uploadId2Src('image/Show?fileId=' + response.data.backIdFilename + '&playerId=' + _this.playerId());
                      }
                      _this.showMessage("Documents have been uploaded successfully.");
                      _this.submitted(true);
                    }
                    $('input#' + _this.uploadId1FieldId()).data().ace_file_input.disable();
                    return $('input#' + _this.uploadId2FieldId()).data().ace_file_input.disable();
                  }
                };
                return req;
              };
            })(this)
          });
        } else {
          return this.errors.showAllMessages();
        }
      };

      return ViewModel;

    })();
    return new ViewModel();
  });

}).call(this);
