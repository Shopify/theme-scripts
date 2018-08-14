import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import extend from "lodash-es/extend";
import { serializeArray } from "./src/utils";

var ProductForm = function () {
  function ProductForm() {
    var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ProductForm);

    this.selectors = {
      productForm: "[data-productform]",
      productJSON: "[data-product-json]",
      optionInputs: "[data-option-input]"
    };

    this.selectors = extend({}, this.selectors, selectors);

    this.form = document.querySelector(this.selectors.productForm);
    this.optionInputs = this.form.querySelectorAll(this.selectors.optionInputs);
    this.productJSON = this.form.querySelector(this.selectors.productJSON).innerText;
    this.product = JSON.parse(this.productJSON);

    this.bindEvents();
  }

  _createClass(ProductForm, [{
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
      return serializeArray(this.form);
    }
  }, {
    key: "quantity",
    get: function get() {
      // Get quantity
    }
  }]);

  return ProductForm;
}();

export default ProductForm;
