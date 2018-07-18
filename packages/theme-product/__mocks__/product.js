function getProductJsonMock() {
  return JSON.stringify({
    id: 520670707773,
    title: "Aircontact 75 + 10",
    vendor: "tauclothes",
    variants: [
      {
        id: 6908023078973,
        product_id: 520670707773,
        title: "36 / Black",
        option1: "36",
        option2: "Black",
        options: ["36", "Black"]
      },
      {
        id: 6908198682685,
        product_id: 520790016061,
        title: "37 / Black",
        option1: "37",
        option2: "Black",
        options: ["37", "Black"]
      },
      {
        id: 6908198649917,
        product_id: 520790016061,
        title: "38 / Black",
        option1: "38",
        option2: "Black",
        options: ["38", "Black"]
      }
    ],
    options: [
      {
        id: 967657816125,
        product_id: 675815555133,
        name: "Size",
        position: 1,
        values: ["36", "37", "38"]
      },
      {
        id: 967657848893,
        product_id: 675815555133,
        name: "Color",
        position: 2,
        values: ["Black"]
      }
    ],
    images: [
      {
        id: 2004809744445,
        product_id: 520670707773,
        variant_ids: []
      }
    ],
    image: {
      id: 2004809744445,
      product_id: 520670707773,
      variant_ids: []
    }
  });
}

export { getProductJsonMock };
