const express = require("express");
const app = express();
const cors = require("cors");
const port = 3041;

const getUser = require("./scripts/generate");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const e = require("express");

app.use(cors());
app.use(express.json());

let ledger = {};
const user1 = getUser();
const user2 = getUser();
const user3 = getUser();
let users = [user1, user2, user3];

// for (let i = 0; i < users.length; i++) {
//   console.log(`user ${i + 1}:`, users[i]);
// }

const balances = {
  [user1.address]: 100,
  [user2.address]: 50,
  [user3.address]: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/accounts", (req, res) => {
  const account = [
    {
      privateKey: user1.privateKey,
      address: user1.address,
      balance: balances[user1.publicKey],
    },
    {
      privateKey: user2.privateKey,
      address: user2.address,
      balance: balances[user2.publicKey],
    },
    {
      privateKey: user3.privateKey,
      address: user3.address,
      balance: balances[user3.publicKey],
    },
  ];
  res.send(account);
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signatureHex, recoveryBit, nextNonce } =
    req.body;
  const msgArray = utf8ToBytes(amount + recipient);
  const msgHash = toHex(msgArray);

  const recoveredPublicKey = secp.recoverPublicKey(
    msgHash,
    signatureHex,
    recoveryBit
  );
  const verified = secp.verify(signatureHex, msgHash, recoveredPublicKey);
  sender.toString();
  const addressExist = sender in ledger;
  if (!addressExist) {
    ledger = { ...ledger, [sender]: 0 };
  } else if (addressExist) {
    ledger[sender] = nextNonce;
  }
  // console.log(ledger);
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (!verified) {
    res.status(400).send({ message: "Invalid Signature" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    ledger = { ...ledger, [sender]: ledger[sender] + 1 };
    res.send({ balance: balances[sender], nonce: ledger[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
