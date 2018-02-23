import extend from "lodash-es/extend";
import serializeArray from "utils";

class ProductForm {
  selectors = {
    productForm: "[data-productform]",
    productJSON: "[data-product-json]",
    optionInputs: "[data-option-input]"
  };

  constructor(selectors = {}) {
    this.selectors = extend({}, this.selectors, selectors);

    this.form = document.querySelector(this.selectors.productForm);
    this.optionInputs = this.form.querySelectorAll(this.selectors.optionInputs);
    this.productJSON = this.form.querySelector(
      this.selectors.productJSON
    ).innerText;
    this.product = JSON.parse(this.productJSON);

    this.bindEvents();
  }
  get title() {
    return this.product.title;
  }
  get id() {
    return this.product.id;
  }
  get availability() {
    return this.product.available;
  }
  get options() {
    return serializeArray(this.form);
  }
  get quantity() {
    // Get quantity
  }
  bindEvents() {
    this.optionInputs.forEach(input => {
      input.addEventListener("change", this.handleChange.bind(this));
    });
  }
  handleChange() {
    this.createState();
    const event = new CustomEvent("variant_change", {
      detail: this.state
    });
    document.dispatchEvent(event);
  }
  handleAddToCart() {
    this.createState();
    const event = new CustomEvent("variant_addToCart", {
      detail: this.state
    });
    document.dispatchEvent(event);
  }
  createState() {
    this.state = {
      title: this.title,
      id: this.id,
      available: this.availability,
      options: this.options,
      quantity: this.quantity
    };
  }
}

export default ProductForm;
