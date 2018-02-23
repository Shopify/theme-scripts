"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _extend = require("lodash-es/extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("./src/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductForm = function () {
  function ProductForm() {
    var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, ProductForm);
    this.selectors = {
      productForm: "[data-productform]",
      productJSON: "[data-product-json]",
      optionInputs: "[data-option-input]"
    };

    this.selectors = (0, _extend2.default)({}, this.selectors, selectors);

    this.form = document.querySelector(this.selectors.productForm);
    this.optionInputs = this.form.querySelectorAll(this.selectors.optionInputs);
    this.productJSON = this.form.querySelector(this.selectors.productJSON).innerText;
    this.product = JSON.parse(this.productJSON);

    this.bindEvents();
  }

  (0, _createClass3.default)(ProductForm, [{
    key: "bindEvents",
    value: function bindEvents() {
      var _this = this;

      this.optionInputs.forEach(function (input) {
        input.addEventListener("change", _this.handleChange.bind(_this));
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange() {
      this.createState();
      var event = new CustomEvent("variant_change", {
        detail: this.state
      });
      document.dispatchEvent(event);
    }
  }, {
    key: "handleAddToCart",
    value: function handleAddToCart() {
      this.createState();
      var event = new CustomEvent("variant_addToCart", {
        detail: this.state
      });
      document.dispatchEvent(event);
    }
  }, {
    key: "createState",
    value: function createState() {
      this.state = {
        title: this.title,
        id: this.id,
        available: this.availability,
        options: this.options,
        quantity: this.quantity
      };
    }
  }, {
    key: "title",
    get: function get() {
      return this.product.title;
    }
  }, {
    key: "id",
    get: function get() {
      return this.product.id;
    }
  }, {
    key: "availability",
    get: function get() {
      return this.product.available;
    }
  }, {
    key: "options",
    get: function get() {
      return (0, _utils.serializeArray)(this.form);
    }
  }, {
    key: "quantity",
    get: function get() {
      // Get quantity
    }
  }]);
  return ProductForm;
}();

exports.default = ProductForm;
