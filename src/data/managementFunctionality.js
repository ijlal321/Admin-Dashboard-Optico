export const adminOptions = [
  {title:"Add Stock", href:"/add-stock"},
  {title:"Manage Stock", href:"/manage-stock"},
  {title:"View Orders", href:"/view-orders"},
  {title:"Reports and Analytics", href:"/reports-analytics"},
  {title:"Remove Stock", href:"/remove-stock"},
];

export const frameAttributes = {
  Brand: ["a", "b", "c", "d", "e"],
  Shape: ["a", "b", "c", "d", "e"],
  Material: ["a", "b", "c", "d", "e"],
  Sex: ["Male", "Female", "Kids"],
  Tags: ["a", "b", "c", "d", "e"],
  Price:[1000, 2000, 3000],
  Discount:[5, 10, 15, 20, 25,]
};

export const sg_Attributes = {
  Name: ["a", "b", "c", "d", "e"],
  Description: ["a", "b", "c", "d", "e"],
  Tags: ["a", "b", "c", "d", "e"],
  Price:[1000, 2000, 3000],
  Discount:[5, 10, 15, 20, 25,]
};

export const frameColors = ["transparent", "black", "red", "blue", "green", "orange"];
export const locations = ["Display", "Behind Display", "Back"];
export const stockQuantity = [1, 3, 5, 10]

export const productTypes = ["Frames", "Sunglasses", "Reading Glasses"];

export const sunGlassesLensType = ["Polarized", "Tinted", "Double Shade", "Glass"];

export const sunGlassAttributes = {
  Brand: ["a", "b", "c", "d", "e"],
  Shape: ["a", "b", "c", "d", "e"],
  Material: ["a", "b", "c", "d", "e"],
  Sex: ["Male", "Female", "Kids"],
  Tags: ["a", "b", "c", "d", "e"],
  Price:[1000, 2000, 3000],
  Discount:[5, 10, 15, 20, 25,],
  Lens_Type: ["Polarized", "Tinted", "Double Shade", "Glass"],
  Prescription_Possible: ["Yes", "No"],
  Copy_Type:["A+", "Branded", "Regular"]
};

export const sunGlassLensColor = ["Green", "Grey", "Brown"];

export const barcodeImgId = "barcode-img"

export const frameBuyAttributes = {
  "Frame info":[],
  "Frame price" :[],
  lens_info:[],
  lens_price:[]
}

export const sunGlassBuyAttributes = {
  "Sunglass info":[],
  "Sunglass price" :[],
  lens_info:[],
  lens_price:[],
  other_price:[]
}

export const readingGlassBuyAttributes = {
  "Reading Glass info":[],
  "Reading Glass price" :[],
  power:[]
}

export const productInfo = [
  "barcode", "product_id", "variant_id", "front_img", "side_img"
]

export const prescriptionAttributes = {
  "left_sph":[],
  "left_cyl":[],
  "left_axis":[],
  "left_vision":[],
  "right_sph":[],
  "right_cyl":[],
  "right_axis":[],
  "right_vision":[],
  "addition":[],
  "checked_by":[],
  "date":[]
}

export const canBeEmpty = ["tags", "discount"]
export const numericFields = ["Price", "Discount", "Stock", "Power"];
export const singleFields = ["Price", "Discount", "Stock", "Lens", "Lens Color", "is Prescription Lens Available", "Power", "Prescription_Possible"];

export const folderNameFromTitle = {
  Frame:"frames",
  Sunglass:"sunglass",
  "Reading Glass":"special_glasses"
}