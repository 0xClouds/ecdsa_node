import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export const signature = async (amount, recipient, privateKey) => {
  const msgArray = utf8ToBytes(amount + recipient);
  const msgHash = toHex(msgArray);
  const [sig, recoveryBit] = await secp.sign(msgHash, privateKey, {
    recovered: true,
  });

  const signatureHex = toHex(sig);
  const recovered = secp.recoverPublicKey(msgHash, sig, recoveryBit);

  return { signatureHex, recoveryBit };
};
