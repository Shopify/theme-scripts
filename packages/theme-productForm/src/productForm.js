const selectors = {
  productForm: "[data-productform]",
  container: "[data-product-container]",
  productJSON: "[data-product-json]",
  optionInputs: "[data-option-input]",
  quantityInput: "[data-product-quantity]"
};

function serializeArray(form) {
  let field,
    l,
    s = [];
  if (typeof form === "object" && form.nodeName == "FORM") {
    const len = form.elements.length;
    for (let i = 0; i < len; i++) {
      field = form.elements[i];
      if (
        field.name &&
        !field.disabled &&
        field.type != "file" &&
        field.type != "reset" &&
        field.type != "submit" &&
        field.type != "button"
      ) {
        if (field.type == "select-multiple") {
          l = form.elements[i].options.length;
          for (j = 0; j < l; j++) {
            if (field.options[j].selected)
              s[s.length] = { name: field.name, value: field.options[j].value };
          }
        } else if (
          (field.type != "checkbox" && field.type != "radio") ||
          field.checked
        ) {
          s[s.length] = { name: field.name, value: field.value };
        }
      }
    }
  }
  return s;
}

class ProductForm {
  constructor(form) {
    this.form = document.querySelector(form);
    this.optionInputs = this.form.querySelectorAll(selectors.optionInputs);
    this.productJSON = this.form.querySelector(selectors.productJSON).innerText;
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
