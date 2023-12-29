<br/>
<p align="center">
<a href=" " target="_blank">
<img src="https://bafybeifozdhcbbfydy2rs6vbkbbtj3wc4vjlz5zg2cnqhb2g4rm2o5ldna.ipfs.w3s.link/dataverse.svg" width="180" alt="Dataverse logo">
</a >
</p >
<br/>

# DataToken Contracts SDK

## Installation

```sh
pnpm install
```

## Build

```sh
pnpm build
```

## Test

`MUMBAI_RPC_URL`, `BSCT_RPC_URL`, and `PRIVATE_KEY` need to be set in the `../.env` as `../.env.example` showed.

Additionally, our tests are conducted on a forked chain. Please ensure that the wallet address corresponding to the private key has some `MATIC` and `WMATIC` tokens in the `MUMBAI` environment, as well as `BNB` and `BUSD` tokens in the BSCT environment. Otherwise, the tests will fail.

### 1. Test in MUMBAI

```sh
pnpm fork:mumbai
pnpm test:mumbai
```
### 2. Test in BSCT

```sh
pnpm fork:bsct
pnpm test:bsct
```

## Examples

### 1. LensDataToken

```ts
const rpcUrl = ;
const lensProfileId = ;
const privateKey = ;
const WMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl, 80001);
signer = new ethers.Wallet(privateKey, provider);
dataTokenFactory = new DataTokenFactory({ env: "Mumbai", signer });

const input: CreateDataTokenInput = {
  type: GraphType.Lens,
  profileId: lensProfileId,
  contentURI,
  collectModule: DeployedContracts.PolygonMumbai.Lens.FeeCollectModule,
  collectLimit: 100,
  followerOnly: false,
  recipient: await signer.getAddress(),
  referralFee: 0,
  currency: WMATIC,
  amount: ethers.utils.parseEther("0.001"),
};

const { dataToken } = await dataTokenFactory.createDataToken(input);
lensDataToken = new DataToken({
  env: "Mumbai",
  type: GraphType.Lens,
  dataTokenAddress: dataToken,
  signer,
});

await lensDataToken.collect();
```

### 2. CyberDataToken

```ts
const rpcUrl = ;
const cyberProfileId = ;
const privateKey = ;
const BUSD = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl, 97);
signer = new ethers.Wallet(privateKey, provider);
dataTokenFactory = new DataTokenFactory({ env: "BSCT", signer });

const input = {
  type: GraphType.Cyber,
  profileId: cyberProfileId,
  name: "EssByCollectPay",
  symbol: "DEMO",
  contentURI,
  essenceMw: DeployedContracts.BSCTestnet.Cyber.CollectPaidMw,
  transferable: true,
  deployAtRegister: false,
  totalSupply: 10,
  amount: ethers.utils.parseEther("0.001"),
  recipient: await signer.getAddress(),
  currency: BUSD,
  subscribeRequired: false,
  deadline: (Math.floor(Date.now() / 1000) + 60 * 60 * 24).toString(),
};

const { dataToken } = await dataTokenFactory.createDataToken(input);

cyberDataToken = new DataToken({
  env: "BSCT",
  type: GraphType.Cyber,
  dataTokenAddress: dataToken,
  signer,
});

await cyberDataToken.collect();
```

### 3. ProfilelessDataToken

```ts
const rpcUrl = ;
const privateKey = ;
const WMATIC = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl, 80001);
signer = new ethers.Wallet(privateKey, provider);
dataTokenFactory = new DataTokenFactory({ env: "Mumbai", signer });

const input: CreateDataTokenInput = {
    type: GraphType.Profileless,
    contentURI,
    collectModule: DeployedContracts.PolygonMumbai.Profileless.FeeCollectModule,
    collectLimit: 100,
    amount: ethers.utils.parseEther("0.001"),
    currency: WMATIC,
    recipient: await signer.getAddress(),
};

const { dataToken } = await dataTokenFactory.createDataToken(input);
profilelessDataToken = new DataToken({
    env: "Mumbai",
    type: GraphType.Profileless,
    dataTokenAddress: dataToken,
    signer,
});

await profilelessDataToken.collect();
```
