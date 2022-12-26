import { useEffect, useState } from "react";
import server from "./server";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: _accounts } = await server.get("accounts");
      setAccounts(_accounts);
    })();
  }, []);

  return (
    <div id="container">
      <div>
        <h1>Accounts</h1>
        {accounts.map((account, index) => (
          <div key={index}>
            <div>PrivateKey: {account.privateKey}</div>
            <div> Address: {account.address} </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
