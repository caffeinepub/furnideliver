import Migration "migration";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";

(with migration = Migration.run)
actor {
  type Delivery = {
    id : Nat;
    customerName : Text;
    phone : Text;
    address : Text;
    productName : Text;
    deliveryDate : Text;
    driverName : Text;
    notes : Text;
    status : Text;
    createdAt : Int;
  };

  module Delivery {
    public func compare(d1 : Delivery, d2 : Delivery) : Order.Order {
      Nat.compare(d1.id, d2.id);
    };
  };

  var nextDeliveryId = 0;
  let deliveries = Map.empty<Nat, Delivery>();

  public shared ({ caller }) func createDelivery(customerName : Text, phone : Text, address : Text, productName : Text, deliveryDate : Text, driverName : Text, notes : Text) : async Delivery {
    let delivery : Delivery = {
      id = nextDeliveryId;
      customerName;
      phone;
      address;
      productName;
      deliveryDate;
      driverName;
      notes;
      status = "Pending";
      createdAt = Time.now();
    };
    deliveries.add(nextDeliveryId, delivery);
    nextDeliveryId += 1;
    delivery;
  };

  public query ({ caller }) func getDeliveries() : async [Delivery] {
    deliveries.values().toArray().sort();
  };

  public shared ({ caller }) func updateDelivery(id : Nat, customerName : Text, phone : Text, address : Text, productName : Text, deliveryDate : Text, driverName : Text, notes : Text, status : Text) : async Delivery {
    switch (deliveries.get(id)) {
      case (null) { Runtime.trap("Delivery not found") };
      case (?delivery) {
        let updatedDelivery : Delivery = {
          delivery with
          customerName;
          phone;
          address;
          productName;
          deliveryDate;
          driverName;
          notes;
          status;
        };
        deliveries.add(id, updatedDelivery);
        updatedDelivery;
      };
    };
  };

  public shared ({ caller }) func deleteDelivery(id : Nat) : async () {
    if (not deliveries.containsKey(id)) { Runtime.trap("Delivery not found") };
    deliveries.remove(id);
  };

  type Product = {
    id : Nat;
    name : Text;
    code : Text;
    category : Text;
    costPrice : Float;
    sellingPrice : Float;
    lowStockThreshold : Nat;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  var nextProductId = 0;
  let products = Map.empty<Nat, Product>();

  public shared ({ caller }) func createProduct(name : Text, code : Text, category : Text, costPrice : Float, sellingPrice : Float, lowStockThreshold : Nat) : async Product {
    let product : Product = {
      id = nextProductId;
      name;
      code;
      category;
      costPrice;
      sellingPrice;
      lowStockThreshold;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, code : Text, category : Text, costPrice : Float, sellingPrice : Float, lowStockThreshold : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct : Product = {
          product with
          name;
          code;
          category;
          costPrice;
          sellingPrice;
          lowStockThreshold;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) { Runtime.trap("Product not found") };
    products.remove(id);
  };

  type IncomingStock = {
    id : Nat;
    productId : Nat;
    productName : Text;
    quantity : Nat;
    supplierName : Text;
    expectedDate : Text;
    status : Text;
  };

  module IncomingStock {
    public func compare(s1 : IncomingStock, s2 : IncomingStock) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  var nextStockId = 0;
  let incomingStock = Map.empty<Nat, IncomingStock>();

  public shared ({ caller }) func addIncomingStock(productId : Nat, productName : Text, quantity : Nat, supplierName : Text, expectedDate : Text) : async IncomingStock {
    if (not products.containsKey(productId)) { Runtime.trap("Product not found") };
    let stock : IncomingStock = {
      id = nextStockId;
      productId;
      productName;
      quantity;
      supplierName;
      expectedDate;
      status = "Ordered";
    };
    incomingStock.add(nextStockId, stock);
    nextStockId += 1;
    stock;
  };

  public query ({ caller }) func getIncomingStock() : async [IncomingStock] {
    incomingStock.values().toArray().sort();
  };

  public shared ({ caller }) func updateIncomingStockStatus(id : Nat, status : Text) : async IncomingStock {
    switch (incomingStock.get(id)) {
      case (null) { Runtime.trap("Incoming stock not found") };
      case (?stock) {
        let updatedStock : IncomingStock = {
          stock with status;
        };
        incomingStock.add(id, updatedStock);
        updatedStock;
      };
    };
  };

  type Sale = {
    id : Nat;
    productId : Nat;
    productName : Text;
    quantity : Nat;
    customerName : Text;
    saleDate : Text;
  };

  module Sale {
    public func compare(s1 : Sale, s2 : Sale) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  var nextSaleId = 0;
  let sales = Map.empty<Nat, Sale>();

  public shared ({ caller }) func recordSale(productId : Nat, productName : Text, quantity : Nat, customerName : Text, saleDate : Text) : async () {
    let sale : Sale = {
      id = nextSaleId;
      productId;
      productName;
      quantity;
      customerName;
      saleDate;
    };
    sales.add(nextSaleId, sale);
    nextSaleId += 1;
  };

  public query ({ caller }) func getSales() : async [Sale] {
    sales.values().toArray().sort();
  };

  public query ({ caller }) func getInventorySummary() : async [InventorySummary] {
    products.values().toArray().map(getProductStockSummary);
  };

  type InventorySummary = {
    productId : Nat;
    productName : Text;
    productCode : Text;
    category : Text;
    currentStock : Int;
    incomingPending : Nat;
    soldQty : Nat;
    lowStockThreshold : Nat;
  };

  func getProductStockSummary(product : Product) : InventorySummary {
    let receivedStock = incomingStock.values().toArray().filter(
      func(stock) {
        stock.productId == product.id and stock.status == "Received"
      }
    );

    let totalReceived = receivedStock.foldLeft(0, func(acc, stock) { acc + stock.quantity });

    let pendingStock = incomingStock.values().toArray().filter(
      func(stock) {
        stock.productId == product.id and stock.status == "Ordered"
      }
    );

    let totalPending = pendingStock.foldLeft(0, func(acc, stock) { acc + stock.quantity });

    let productSales = sales.values().toArray().filter(
      func(sale) { sale.productId == product.id }
    );

    let totalSales = productSales.foldLeft(0, func(acc, sale) { acc + sale.quantity });

    let currentStock = totalReceived - totalSales;

    {
      productId = product.id;
      productName = product.name;
      productCode = product.code;
      category = product.category;
      currentStock;
      incomingPending = totalPending;
      soldQty = totalSales;
      lowStockThreshold = product.lowStockThreshold;
    };
  };
};
