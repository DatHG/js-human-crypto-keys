"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cryptoKeyComposer = require("crypto-key-composer");
var rsa = _interopRequireWildcard(require("./keys/rsa"));
var ed25519 = _interopRequireWildcard(require("./keys/ed25519"));
var _errors = require("./utils/errors");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const supportedAlgorithms = {
  rsa,
  ed25519
};
const buildParams = (defaultParams, customParams) => Object.keys(customParams).reduce((params, key) => {
  // Do not allow unknown keys (params)
  if (defaultParams[key] == null) {
    throw new _errors.UnknownAlgorithmParamError(key);
  }

  // Do not allow nullish values
  if (customParams[key] == null) {
    throw new _errors.NilAlgorithmParamError(key);
  }

  // Do not allow different types
  if (typeof customParams[key] !== typeof defaultParams[key]) {
    throw new _errors.TypeMismatchAlgorithmParamError(key, typeof defaultParams[key]);
  }
  params[key] = customParams[key];
  return params;
}, {
  ...defaultParams
});
const parseAlgorithm = keyAlgorithm => {
  const algorithm = typeof keyAlgorithm === 'string' ? {
    id: keyAlgorithm
  } : keyAlgorithm;
  const type = supportedAlgorithms[algorithm.id] ? algorithm.id : (0, _cryptoKeyComposer.getKeyTypeFromAlgorithm)(algorithm.id);
  if (!type) {
    throw new _errors.UnknownAlgorithmError(algorithm.id);
  }
  const {
    generateKeyPair,
    defaultParams
  } = supportedAlgorithms[type];
  const {
    id,
    ...customParams
  } = algorithm;
  const params = buildParams(defaultParams, customParams);
  return {
    id,
    type,
    params,
    generate: generateKeyPair
  };
};
var _default = parseAlgorithm;
exports.default = _default;
module.exports = exports.default;