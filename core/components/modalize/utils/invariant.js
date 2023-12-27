const genericMessage = 'Invariant Violation "react-native-modalize"';

const {
    setPrototypeOf = (obj, proto) => {
        obj.__proto__ = proto;
        return obj;
    },
} = Object;

class InvariantError extends Error {
  framesToPop = 1;

  name = genericMessage;

  constructor(message = genericMessage) {
      super(`${message}`);

      setPrototypeOf(this, InvariantError.prototype);
  }
}

export const invariant = (condition, message) => {
    if (condition) {
        throw new InvariantError(message);
    }
};
