# Hyperledger Fabric

- Orderer Org => orderer
- Peer Org => Peer

- Chaincode

- Gateway

- Node.js Server


# Transaction Flow for Demo

1. Seller - Make estate available for sell

2. Buyer - Request the estate to buy, using ULPIN

3. Seller - View and accept/reject request from buyer

if request is accepted:

3. Buyer - Pay Stamp Duty and Registration Charges

4. Registrar - Verify and accept/reject the transaction

**TRANSACTION COMPLETE - Estate transferred**


---































__Web__

General 

- home/dashboard
- login 

Sub-Reg 

- Add user 
- Add estate 
- Verify and Approve Transactions 

User 

- Set estate sell availability status 
- Show Owned estates 
- Show History of estate
- Buy estate 
- Proposal 
- Pay stamp duty 
- Pay registration charges 

Guest

- Find estate details, history 

---

__API/Services__

- for OTP / Aadhaar Auth with OTP 
- get Aadhaar data using Aadhaar No. 
- Stamp duty payment 
- Reg charges payment