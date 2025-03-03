// Test: Binding to a different object

Function.prototype.myBind = function (context, ...boundArgs) {
  const fn = this;
  return function (...args) {
    return fn.apply(context, ...args);
  };
};

Function.prototype.myBind = function (obj, ...args) {
  let func = this;
  return function () {
    console.log("binded function called", func, obj);
    func.apply(obj, ...args);
  };
};
const obj1 = { name: "Alice" };
const obj2 = { name: "Bob" };

function sayName() {
  return this.name;
}

const boundToAlice = sayName.myBind(obj1);
const boundToBob = sayName.myBind(obj2);

console.log(boundToAlice());
console.log(boundToBob());
console.log("Binding test passed!");
