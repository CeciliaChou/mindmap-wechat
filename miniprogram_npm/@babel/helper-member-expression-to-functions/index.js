module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1554222954161, function(require, module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = memberExpressionToFunctions;

function t() {
  const data = _interopRequireWildcard(require("@babel/types"));

  t = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class AssignmentMemoiser {
  constructor() {
    this._map = new WeakMap();
  }

  has(key) {
    return this._map.has(key);
  }

  get(key) {
    if (!this.has(key)) return;

    const record = this._map.get(key);

    const {
      value
    } = record;
    record.count--;

    if (record.count === 0) {
      return t().assignmentExpression("=", value, key);
    }

    return value;
  }

  set(key, value, count) {
    return this._map.set(key, {
      count,
      value
    });
  }

}

const handle = {
  memoise() {},

  handle(member) {
    const {
      node,
      parent,
      parentPath
    } = member;

    if (parentPath.isUpdateExpression({
      argument: node
    })) {
      const {
        operator,
        prefix
      } = parent;
      this.memoise(member, 2);
      const value = t().binaryExpression(operator[0], t().unaryExpression("+", this.get(member)), t().numericLiteral(1));

      if (prefix) {
        parentPath.replaceWith(this.set(member, value));
      } else {
        const {
          scope
        } = member;
        const ref = scope.generateUidIdentifierBasedOnNode(node);
        scope.push({
          id: ref
        });
        value.left = t().assignmentExpression("=", t().cloneNode(ref), value.left);
        parentPath.replaceWith(t().sequenceExpression([this.set(member, value), t().cloneNode(ref)]));
      }

      return;
    }

    if (parentPath.isAssignmentExpression({
      left: node
    })) {
      const {
        operator,
        right
      } = parent;
      let value = right;

      if (operator !== "=") {
        this.memoise(member, 2);
        value = t().binaryExpression(operator.slice(0, -1), this.get(member), value);
      }

      parentPath.replaceWith(this.set(member, value));
      return;
    }

    if (parentPath.isCallExpression({
      callee: node
    })) {
      const {
        arguments: args
      } = parent;
      parentPath.replaceWith(this.call(member, args));
      return;
    }

    member.replaceWith(this.get(member));
  }

};

function memberExpressionToFunctions(path, visitor, state) {
  path.traverse(visitor, Object.assign({}, handle, state, {
    memoiser: new AssignmentMemoiser()
  }));
}
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1554222954161);
})()
//# sourceMappingURL=index.js.map