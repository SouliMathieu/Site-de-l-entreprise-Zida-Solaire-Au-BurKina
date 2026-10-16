
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const path = require("node:path");
const Module = require("node:module");
const { PrismaClient } = require("@prisma/client");
if (process.env.INVENTORY_TEST_DATABASE !== "isolated-postgres" || !/localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || "")) {
  throw new Error("Inventory integration tests require isolated local PostgreSQL.");
}
require("ts-node").register({ transpileOnly: true, compilerOptions: { module: "CommonJS", moduleResolution: "node" } });
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  return originalResolve.call(this, request.startsWith("@/") ? path.join(process.cwd(), request.slice(2)) : request, parent, ...args);
};
const { createOrderWithReservedStock, transitionOrderWithInventory, deleteOrderWithInventory } = require("../lib/order-inventory.ts");
const db = new PrismaClient();
const tag = "INVTEST-" + randomUUID().slice(0, 8);
let category, customer;
const products = [];

async function fixture() {
  if (category) return;
  category = await db.category.create({ data: { name: tag, slug: tag.toLowerCase() } });
  customer = await db.customer.create({ data: { firstName: "Test", lastName: "Inventory", phone: "+22699" + String(Date.now()).slice(-6) } });
}
async function product(stock) {
  await fixture();
  const index = products.length + 1;
  const p = await db.product.create({ data: {
    name: tag + index, slug: tag.toLowerCase() + "-" + index, sku: tag + index,
    categoryId: category.id, description: "Tests uniquement", price: "2500", stock,
  } });
  products.push(p);
  return p;
}
function orderData(lines) {
  return {
    orderNumber: tag + randomUUID(), customerId: customer.id, guestCheckout: false,
    paymentMethod: "CASH_ON_DELIVERY", paymentStatus: "PENDING",
    subtotal: "2500", deliveryFee: "0", total: "2500",
    deliveryAddress: "test", deliveryCity: "Ouagadougou", customerPhone: customer.phone,
    items: { create: lines.map((l) => ({
      productId: l.productId, quantity: l.quantity, productName: "Test",
      price: "2500", subtotal: String(2500 * l.quantity),
    })) },
  };
}
async function reserve(lines) { return createOrderWithReservedStock(orderData(lines), lines); }
async function stock(p) { return (await db.product.findUniqueOrThrow({where:{id:p.id}})).stock; }

test("one winner for two concurrent purchases when stock is one", async () => {
  const p = await product(1);
  const lines = [{productId:p.id, quantity:1}];
  const results = await Promise.allSettled([reserve(lines), reserve(lines)]);
  assert.equal(results.filter(x => x.status === "fulfilled").length, 1);
  assert.equal(results.filter(x => x.status === "rejected").length, 1);
  assert.equal(await stock(p), 0);
});
test("multi-line rollback restores all earlier decrements", async () => {
  const available = await product(2), missing = await product(0);
  await assert.rejects(reserve([{productId:available.id,quantity:1},{productId:missing.id,quantity:1}]));
  assert.equal(await stock(available), 2);
});
test("duplicate product lines cannot exceed inventory", async () => {
  const p = await product(1);
  await assert.rejects(reserve([{productId:p.id,quantity:1},{productId:p.id,quantity:1}]));
  assert.equal(await stock(p), 1);
});
test("cancellation twice and deletion never double credit", async () => {
  const p = await product(2);
  const o = await reserve([{productId:p.id,quantity:1}]);
  assert.equal(await stock(p), 1);
  assert.equal((await transitionOrderWithInventory(o.id,"CANCELLED")).changed, true);
  assert.equal((await transitionOrderWithInventory(o.id,"CANCELLED")).changed, false);
  await deleteOrderWithInventory(o.id);
  assert.equal(await stock(p), 2);
});
test("deleting reserved pending order restores stock", async () => {
  const p = await product(2), o = await reserve([{productId:p.id,quantity:1}]);
  await deleteOrderWithInventory(o.id);
  assert.equal(await stock(p), 2);
});
test("delivered order never returns inventory", async () => {
  const p = await product(2), o = await reserve([{productId:p.id,quantity:1}]);
  await transitionOrderWithInventory(o.id,"DELIVERED");
  await assert.rejects(transitionOrderWithInventory(o.id,"CANCELLED"));
  await deleteOrderWithInventory(o.id);
  assert.equal(await stock(p), 1);
});
test("legacy order without stock reservation does not return inventory", async () => {
  const p = await product(2), o = await db.order.create({ data: orderData([{productId:p.id,quantity:1}]) });
  await transitionOrderWithInventory(o.id,"CANCELLED");
  assert.equal(await stock(p), 2);
});
test("concurrent cancellation and deletion cannot overcredit inventory", async () => {
  const p = await product(1), o = await reserve([{productId:p.id,quantity:1}]);
  await Promise.allSettled([transitionOrderWithInventory(o.id,"CANCELLED"),deleteOrderWithInventory(o.id)]);
  assert.equal(await stock(p), 1);
});
after(async () => {
  if (category) {
    const orders = await db.order.findMany({where:{orderNumber:{startsWith:tag}},select:{id:true}});
    const ids = orders.map(x=>x.id);
    await db.orderItem.deleteMany({where:{orderId:{in:ids}}});
    await db.order.deleteMany({where:{id:{in:ids}}});
    await db.product.deleteMany({where:{categoryId:category.id}});
    await db.category.delete({where:{id:category.id}});
    await db.customer.delete({where:{id:customer.id}});
  }
  await db.$disconnect();
});
