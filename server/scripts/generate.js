const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

class User {
  constructor(privateKey, publicKey, address) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.address = address;
  }
}

//Create user
function createUser() {
  //Get a random private key
  const privateKey = secp.utils.randomPrivateKey();
  const privateKeyHex = toHex(privateKey);

  //Derive public key from private key
  const publicKey = secp.getPublicKey(privateKey);

  const publicKeyHex = toHex(publicKey);

  //Take last 20 bytes of public key and use that ass an address
  function getAddress(publicKey) {
    const publicKeySliced = publicKey.slice(1);
    const publicKeyHash = keccak256(publicKeySliced);
    return publicKeyHash.slice(12);
  }
  const address = getAddress(publicKey);
  const addressHex = toHex(address);

  return new User(privateKeyHex, publicKeyHex, addressHex);
}

module.exports = createUser;
