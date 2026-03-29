import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldActor = {
    deliveries : Map.Map<Nat, {
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
    }>;
    nextId : Nat;
  };

  type NewActor = {
    deliveries : Map.Map<Nat, {
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
    }>;
    nextDeliveryId : Nat;
    nextProductId : Nat;
    products : Map.Map<Nat, {
      id : Nat;
      name : Text;
      code : Text;
      category : Text;
      costPrice : Float;
      sellingPrice : Float;
      lowStockThreshold : Nat;
    }>;
    nextStockId : Nat;
    incomingStock : Map.Map<Nat, {
      id : Nat;
      productId : Nat;
      productName : Text;
      quantity : Nat;
      supplierName : Text;
      expectedDate : Text;
      status : Text;
    }>;
    nextSaleId : Nat;
    sales : Map.Map<Nat, {
      id : Nat;
      productId : Nat;
      productName : Text;
      quantity : Nat;
      customerName : Text;
      saleDate : Text;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    {
      deliveries = old.deliveries;
      nextDeliveryId = old.nextId;
      nextProductId = 0;
      products = Map.empty<Nat, {
        id : Nat;
        name : Text;
        code : Text;
        category : Text;
        costPrice : Float;
        sellingPrice : Float;
        lowStockThreshold : Nat;
      }>();
      nextStockId = 0;
      incomingStock = Map.empty<Nat, {
        id : Nat;
        productId : Nat;
        productName : Text;
        quantity : Nat;
        supplierName : Text;
        expectedDate : Text;
        status : Text;
      }>();
      nextSaleId = 0;
      sales = Map.empty<Nat, {
        id : Nat;
        productId : Nat;
        productName : Text;
        quantity : Nat;
        customerName : Text;
        saleDate : Text;
      }>();
    };
  };
};
