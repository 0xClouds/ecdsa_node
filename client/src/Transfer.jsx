import { useEffect } from "react";
import { useState } from "react";
import server from "./server";
import { signature } from "./sign";
function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [addressToNonce, setAddressToNonce] = useState({});
  const [nextNonce, setNextNonce] = useState(1);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const addressExist = address in addressToNonce;
    if (!addressExist) {
      setAddressToNonce({ ...addressToNonce, [address]: 0 });
    }
    try {
      const { signatureHex, recoveryBit } = await signature(
        sendAmount,
        recipient,
        privateKey
      );

      const {
        data: { balance, nonce },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signatureHex,
        recoveryBit,
        nextNonce: nextNonce,
      });
      setBalance(balance);
      setAddressToNonce({ ...addressToNonce, [address]: nextNonce });
      console.log(nextNonce);
      setNextNonce(nonce);
      console.log(nextNonce);
      alert(`Transaction Succesfull sent: ${sendAmount} ETH to ${recipient}`);
    } catch (ex) {
      alert(ex);
    }
  }

  useEffect(() => {
    console.log(addressToNonce);
  }, [addressToNonce]);

  return (
    <>
      <form className="container transfer" onSubmit={transfer}>
        <h1>Send Transaction</h1>

        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></input>
        </label>

        <label>
          Recipient
          <input
            placeholder="Type an address, for example: 0x2"
            value={recipient}
            onChange={setValue(setRecipient)}
          ></input>
        </label>

        <input type="submit" className="button" value="Transfer" />
      </form>
      <div>
        <button
          onClick={() => {
            console.log(addressToNonce);
          }}
        >
          See Current Nonce
        </button>
      </div>
    </>
  );
}

export default Transfer;
