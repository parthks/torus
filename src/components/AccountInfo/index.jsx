import React, { useEffect, useState } from "react";
import { PageHeader, Button, Spin } from "antd";
import "./style.scss";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { Keypair } from "@solana/spl-token/node_modules/@solana/web3.js";





function AccountInfo({
  handleLogout, privKey, accountInfo, account,connection
}) {

const [walletInfo, setUserAccountInfo] = useState(accountInfo);

const [loading, setLoading] = useState(false);
 
const [privateKeyHidden, setPkeyVisiblity] = useState(false);
//  useEffect(()=>{
//   console
//  },[walletInfo])


const mintToken = async () => {
  setLoading(true)

   // Generate a new wallet to newly mint tokens
  //  const mintWallet = Keypair.generate();

  // SIGNATURE VERIFICATION FAIL!!!
  //create new token mint
  const mint = await Token.createMint(
    connection,
    account,
    account.publicKey,
    // mintWallet.publicKey,
    null,
    0,
    TOKEN_PROGRAM_ID,
  );

  // //get the token account of the toWallet Solana address, if it does not exist, create it
  //   var mintTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
  //     mintWallet.publicKey,
  // );

  //get the token account of the fromWallet Solana address, if it does not exist, create it
  let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    account.publicKey,
  );

  await mint.mintTo(
    fromTokenAccount.address,
    fromTokenAccount,
    // mintTokenAccount,
    [],
    1,
  );


  setLoading(false)
}

const requestAirdrop = async () => {
    setLoading(true)
    const fromAirdropSignature = await connection.requestAirdrop(account.publicKey, LAMPORTS_PER_SOL)
    await connection.confirmTransaction(fromAirdropSignature);
    const accountInfo = await connection.getAccountInfo(account.publicKey);
    setUserAccountInfo(accountInfo);
    setLoading(false)
}


 return (
  <div>
      <PageHeader
          className="site-page-header"
          title="Openlogin x Solana"
          extra={[
              <Button key="1" type="primary" onClick={()=>handleLogout(false)}>
              Logout
              </Button>,
             <Button key="1" type="primary" onClick={()=>handleLogout(true)}>
               Sleep (Fast Login enabled)
            </Button>,
          ]}
      />
      <div className="container">
      <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
          
          {loading ? <Spin /> : <>
          <Button onClick={()=>requestAirdrop()}>AIRDROP</Button>


          <Button onClick={()=>mintToken()}>MINT</Button>
          </>}


          
          <div style={{margin:20}}>
            Wallet address: <i>{account?.publicKey.toBase58()}</i>
          </div>
          <div style={{margin:20}}>
            Balance: <i>{(walletInfo && walletInfo.lamports) || 0}</i>
          </div>
          <hr/>
          <span>Private key:</span>
          {
              !privateKeyHidden ? 
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
                <span style={{margin: 20}}>{"********************************"}</span>
                <button onClick={()=>{setPkeyVisiblity(true)}}>Show Private Key</button>
              </div>:
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
               <span style={{margin: 20}}>{(privKey)}</span>
                <button onClick={()=>{setPkeyVisiblity(false)}}>Hide Private Key</button>
              </div>
            }

        </div>
      </div>
</div>
)
}

export default AccountInfo;