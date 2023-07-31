"use client";
import Image from "next/image";
import {
  getZeroDevSigner,
  getPrivateKeyOwner,
  getRPCProviderOwner,
} from "@zerodevapp/sdk";
import { ethers } from "ethers";
import { useMemo, useState } from "react";
import { ZeroDevWeb3AuthWithModal } from "@zerodevapp/web3auth";
export default function RpcProviderExample() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const setWallet = async (provider: any) => {
    const signer = await getZeroDevSigner({
      projectId: "<your-key>",
      owner: await getRPCProviderOwner(provider),
    });
    setAddress(await signer.getAddress());
  };

  const zeroDevWeb3Auth = useMemo(() => {
    const instance = new ZeroDevWeb3AuthWithModal([
      "<your-key>",
    ]);
    instance.init({
      onConnect: async () => {
        console.log("Console Provider",zeroDevWeb3Auth.provider);
        console.log("I'm connected")
        setLoading(true);
        setWallet(zeroDevWeb3Auth.provider);
        setLoading(false);
      },
    });
    return instance;
  }, []);

  const disconnect = async () => {
    await zeroDevWeb3Auth.logout();
    setAddress("");
  };

  const handleClick = async () => {
    setLoading(true);
    zeroDevWeb3Auth
      .connect("social")
      .then((provider: any) => {
        setWallet(provider);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const connected = !!address;
  return (
    <div>
      {connected && (
        <div>
          <label>Wallet: {address}</label>
        </div>
      )}
      <div>
        {!connected && (
          <button onClick={handleClick} disabled={loading}>
            {loading ? "loading..." : "Create Wallet"}
          </button>
        )}
        {connected && (
          <button onClick={disconnect} disabled={loading}>
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
