﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var DepositHistory,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DepositHistory = (function(_super) {
    var model;

    __extends(DepositHistory, _super);

    function DepositHistory() {
      DepositHistory.__super__.constructor.apply(this, arguments);
      this.depositId = ko.observable();
      this.depositId.subscribe((function(_this) {
        return function(val) {
          return $.get("/api/GetBankAccountForOfflineDeposit?offlineDepositId=" + val, function(data) {
            return _this.bankAccountIdSettings(data);
          });
        };
      })(this));
      this.bankAccountIdSettings = ko.observable();
      this.playerHasValidIdDocuments = ko.observable();
      this.startdate = ko.observable('');
      this.enddate = ko.observable('');
      this.type = ko.observable('');
      this.transferMethod = ko.observable('');
      this.transferBank = ko.observable('');
      this.playerAccountName = ko.observable('');
      this.playerAccountName.subscribe((function(_this) {
        return function(val) {
          $.blockUI();
          return $.get('/api/IsDepositorsFullNameValid?name=' + val, function(data) {
            _this.isFullNameEqualsPlayersFullName(data);
            return $.unblockUI();
          });
        };
      })(this));
      this.isFullNameEqualsPlayersFullName = ko.observable(false);
      this.isReceiptRequiredPaymentLevelCriteria = ko.computed((function(_this) {
        return function() {
          var bankSettings, transferBank, transferMethod;
          bankSettings = _this.bankAccountIdSettings();
          transferMethod = _this.transferMethod();
          transferBank = _this.transferBank();
          if (bankSettings === void 0) {
            return false;
          }
          if (transferMethod === 'InternetBanking' && transferBank === 'SameBank') {
            return bankSettings.internetSameBank;
          } else if (transferMethod === 'CounterDeposit' && transferBank === 'SameBank') {
            return bankSettings.counterDepositSameBank;
          } else if (transferMethod === 'ATM' && transferBank === 'SameBank') {
            return bankSettings.atmSameBank;
          } else if (transferMethod === 'InternetBanking' && transferBank === 'DifferentBank') {
            return bankSettings.internetDifferentBank;
          } else if (transferMethod === 'CounterDeposit' && transferBank === 'DifferentBank') {
            return bankSettings.counterDepositDifferentBank;
          } else if (transferMethod === 'ATM' && transferBank === 'DifferentBank') {
            return bankSettings.atmDifferentBank;
          }
        };
      })(this));
      this.isReceiptRequired = ko.computed((function(_this) {
        return function() {
          if (_this.playerAccountName() === '' || _this.playerAccountName() === void 0) {
            return false;
          }
          if (_this.isReceiptRequiredPaymentLevelCriteria() === true) {
            return true;
          }
          if (_this.playerHasValidIdDocuments() === false) {
            return true;
          }
          if (_this.isFullNameEqualsPlayersFullName() === false) {
            return true;
          }
          return false;
        };
      })(this));
      this.isIdRequired = ko.computed((function(_this) {
        return function() {
          if (_this.playerAccountName() === '' || _this.playerAccountName() === void 0) {
            return false;
          }
          if (_this.playerHasValidIdDocuments() === false) {
            return true;
          }
          if (_this.isFullNameEqualsPlayersFullName() === false) {
            return true;
          }
          return false;
        };
      })(this));
      this.depositReceipt = ko.observable('').extend({
        validation: {
          validator: (function(_this) {
            return function(val) {
              var element, file;
              element = $('input#depositReceipt')[0];
              file = element ? element.files[0] : void 0;
              if (file) {
                return file.size <= _this.maxSize;
              } else {
                return true;
              }
            };
          })(this),
          message: 'Maximum file size is 4Mb.'
        }
      });
      this.idFront = ko.observable('').extend({
        validation: [
          {
            validator: (function(_this) {
              return function(val) {
                var element, file;
                element = $('input#idFront')[0];
                file = element ? element.files[0] : void 0;
                if (file) {
                  return file.size <= _this.maxSize;
                } else {
                  return true;
                }
              };
            })(this),
            message: 'Maximum file size is 4Mb.'
          }
        ]
      });
      this.idBack = ko.observable('').extend({
        validation: [
          {
            validator: (function(_this) {
              return function(val) {
                var element, file;
                element = $('input#idBack')[0];
                file = element ? element.files[0] : void 0;
                if (file) {
                  return file.size <= _this.maxSize;
                } else {
                  return true;
                }
              };
            })(this),
            message: 'Maximum file size is 4Mb.'
          }
        ]
      });
      this.amount = ko.observable();
      this.remark = ko.observable('');
      this.maxSize = 4194304;
      $.blockUI();
      $.get("/api/ArePlayersIdDocumentsValid", (function(_this) {
        return function(data) {
          _this.playerHasValidIdDocuments(data);
          return $.unblockUI();
        };
      })(this));
      this.submitFilter = function() {
        return $.postJson('/api/FilterDepositHistory', {
          start: this.startdate,
          end: this.enddate,
          type: this.type
        }).success((function(_this) {
          return function(response) {
            if (response.hasError) {
              $.each(response.errors, function(propName) {
                var observable;
                observable = _this[propName];
                observable.error = 'error message';
                return observable.__valid__(false);
              });
            } else {
              popupAlert('', '');
            }
            return false;
          };
        })(this));
      };
      this.selectDepositForConfirm = function(id) {
        return this.depositId(id);
      };
      this.submitDepositConfirmation = function() {
        var depositConfirm, serializedForm;
        serializedForm = $('#confirm-deposit-history-id').serializeArray();
        depositConfirm = {
          Id: this.depositId(),
          PlayerAccountName: this.playerAccountName(),
          PlayerAccountNumber: null,
          TransferType: this.transferBank(),
          OfflineDepositType: this.transferMethod(),
          Amount: this.amount(),
          Remark: this.remark(),
          IdFrontImage: this.idFront(),
          IdBackImage: this.idBack(),
          ReceiptImage: this.depositReceipt()
        };
        return $.ajax({
          url: '/api/ValidateConfirmDepositRequest',
          type: 'post',
          data: depositConfirm
        }).success((function(_this) {
          return function(response) {
            var fd, xhr;
            if (response.hasError) {
              return $.each(response.errors, function(propName) {
                var localizedError, observable;
                observable = _this[propName];
                localizedError = i18n.t("apiResponseCodes." + response.errors[propName]);
                if (observable) {
                  observable.error = localizedError;
                  observable.__valid__(false);
                  return observable.isModified(true);
                } else {
                  return popupAlert('Error', localizedError);
                }
              });
            } else {
              xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function(e) {
                if (4 === xhr.readyState) {
                  response = JSON.parse(xhr.responseText);
                  if (response.result === "failed") {
                    return popupAlert('Error', 'Error occured. Contact an administrator.');
                  } else {
                    return redirect("/Home/DepositHistoryConfirmation?depositId=" + _this.depositId());
                  }
                }
              };
              xhr.open('post', '/api/ConfirmOfflineDeposit', true);
              fd = new FormData();
              fd.append('uploadId1', $('#idFront')[0].files[0]);
              fd.append('uploadId2', $('#idBack')[0].files[0]);
              fd.append('depositConfirm', JSON.stringify(depositConfirm));
              return xhr.send(fd);
            }
          };
        })(this));
      };
      this.triggerInputFile = function(target) {
        target = $('#' + target);
        if (target.parent().hasClass('upload')) {
          return target.click();
        }
      };
      this.deleteFile = function(target) {
        $('#' + target).val('').parent().parent().find('img').attr('src', '/Content/images/icon_id.png').end().end().end().parent().removeClass('uploaded').addClass('upload').find('button').hide().removeClass('show');
        this[target](null);
        return false;
      };
    }

    ko.bindingHandlers.fileUpload = {
      init: function(element, valueAccessor) {
        return $(element).change(function() {
          valueAccessor()(element.files[0].name);
          return $(element).parent().removeClass('upload').addClass('uploaded').find('button').show().end().find('input').eq(0).blur();
        });
      }
    };

    $('#deposit-confirmation').one('hidden.bs.modal', function() {
      return window.location.href = window.location.href;
    });

    model = new DepositHistory;

    model.errors = ko.validation.group(model);

    ko.applyBindings(model, document.getElementById("cashier-wrapper"));

    return DepositHistory;

  })(FormBase);

}).call(this);
