export const CATEGORIES = {
  // Parent Categories (Top Level - parentId: null)
  parentCategory: [
    { id: 1, name: "Snacks" },
    { id: 6, name: "Beverages" },
    { id: 11, name: "Water" },
    { id: 14, name: "Ready-to-Eat" },
    { id: 17, name: "Office Supplies" },
  ],

  // Children Categories (Grouped by Parent Name)
  childrenCategory: {
    Snacks: [
      { id: 2, name: "Chips" },
      { id: 3, name: "Cookies" },
      { id: 4, name: "Chocolate" }, // Corrected from "Chocolates" to match mock
      { id: 5, name: "Candy" },
    ],

    Beverages: [
      { id: 7, name: "Soda" },
      { id: 8, name: "Juice" },
      { id: 9, name: "Energy Drinks" },
      { id: 10, name: "Coffee" },
    ],

    Water: [
      { id: 12, name: "Still Water" },
      { id: 13, name: "Sparkling Water" },
    ],

    ReadyToEat: [
      // Key changed from "Ready-to-Eat" to "ReadyToEat" to be safe with object property access
      { id: 15, name: "Instant Noodles" },
      { id: 16, name: "Cup Noodles" },
    ],

    OfficeSupplies: [
      // Key changed from "Office Supplies" to "OfficeSupplies" to be safe
      { id: 18, name: "Stationery" },
      { id: 19, name: "Disposables" },
    ],
  },
};
