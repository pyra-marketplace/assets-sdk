import { BigNumber } from "ethers";
import { describe } from "mocha";

import { DataToken } from "../../src/data-token";
import { DataUnion } from "../../src/data-union";

describe("Graphql Tests", () => {
  it("loadDataTokensCreatedBy", async () => {
    const info = await DataToken.loadDataTokensCreatedBy(
      "0x312eA852726E3A9f633A0377c0ea882086d66666",
    );
    console.log("[loadDataTokensCreatedBy] result: ", info);
  }).timeout(200000);

  it("loadDataTokensCollectedBy", async () => {
    const info = await DataToken.loadDataTokensCollectedBy(
      "0xd10d5b408A290a5FD0C2B15074995e899E944444",
    );
    console.log("[loadDataTokensCollectedBy] result: ", info);
  }).timeout(20000);

  it("isDataTokenCollectedBy", async () => {
    const isCollected = await DataToken.isDataTokenCollectedBy({
      dataTokenId: "0x96C772E1F3305D91B7E9175a67612aC918cd023A",
      collector: "0x96C772E1F3305D91B7E9175a67612aC918cd023A",
    });
    console.log("[isDataTokenCollectedBy] result: ", isCollected);
  }).timeout(20000);

  it("loadDataTokenCollectors", async () => {
    const info = await DataToken.loadDataTokenCollectors(
      "0x40Eb55d8Ea3FFD223C4b1b8549c6eCFd366C734E",
    );
    console.log("[loadDataTokenCollectors] result: ", info);
  }).timeout(20000);

  it("loadDataToken", async () => {
    const info = await DataToken.loadDataToken(
      "0xa8Eee3AadD1BdA6007B8572Bd6264c8Fa29e2A19",
    );
    console.log("[loadDataTokenCollectors] result: ", info);
  }).timeout(20000);

  // dataUnion
  it("loadDataUnionsPublishedBy", async () => {
    const info = await DataUnion.loadDataUnionsPublishedBy(
      "0x312eA852726E3A9f633A0377c0ea882086d66666",
    );
    console.log("[loadDataUnionsPublishedBy] result: ", info);
  }).timeout(20000);

  it("loadDataUnionsCollectedBy", async () => {
    const info = await DataUnion.loadDataUnionsCollectedBy(
      "0xd10d5b408A290a5FD0C2B15074995e899E944444",
    );
    console.log("[loadDataUnionsCollectedBy] result: ", info);
  }).timeout(20000);

  it("loadDataUnion", async () => {
    const info = await DataUnion.loadDataUnion(
      "0xaef33b7500e198f59fb3370d93dcfc4176f27372254c5aba279e41ee913162f8",
    );
    console.log("[loadDataUnion] result: ", info);
  }).timeout(20000);

  it("loadDataUnionSubscriptionsBy", async () => {
    const info = await DataUnion.loadDataUnionSubscriptionsBy({
      dataUnionId:
        "0x5338ec25f72d5a32b2ba31374b004b1b33a51bd2d6d96d54da81e26c5bf1d5d4",
      collector: "0xC567eE1b5343818B8C2A7be39D4221b3F090fc62",
    });
    console.log("[dataUnionDetailCollectedBy] result: ", info);
  });

  it("isDataUnionCollectedBy", async () => {
    const info = await DataUnion.isDataUnionCollectedBy({
      dataUnionId:
        "0x5338ec25f72d5a32b2ba31374b004b1b33a51bd2d6d96d54da81e26c5bf1d5d4",
      collector: "0xC567eE1b5343818B8C2A7be39D4221b3F090fc62",
    });
    console.log("[isDataUnionCollectedBy] result: ", info);
  });

  it("isDataUnionSubscribedBy", async () => {
    let info = await DataUnion.isDataUnionSubscribedBy({
      dataUnionId:
        "0xc13e8bd213d36482e490d7293442b78e8a71a857c02b9117ea3477daca82d498",
      subscriber: "0xd10d5b408A290a5FD0C2B15074995e899E944444",
      timestamp: BigNumber.from("1697704833"),
    });
    console.log("[isDataUnionSubscribedBy] result: ", info);

    info = await DataUnion.isDataUnionSubscribedBy({
      dataUnionId:
        "0xc13e8bd213d36482e490d7293442b78e8a71a857c02b9117ea3477daca82d498",
      subscriber: "0x3fef65F4FE09bCe9dD866c65202a8C39f8c6161f",
      blockNumber: BigNumber.from("41149712"),
    });
    console.log("[isDataUnionSubscribedBy] result: ", info);
  }).timeout(50000);

  it("loadDataUnionCollectors", async () => {
    const info = await DataUnion.loadDataUnionCollectors(
      "0xc13e8bd213d36482e490d7293442b78e8a71a857c02b9117ea3477daca82d498",
    );
    console.log("[loadDataUnionCollectors] result: ", info);
  }).timeout(20000);

  it("loadDataUnionSubscribers", async () => {
    const info = await DataUnion.loadDataUnionSubscribers(
      "0xc13e8bd213d36482e490d7293442b78e8a71a857c02b9117ea3477daca82d498",
    );
    console.log("[loadDataUnionSubscribers] result: ", info);
  });

  it("loadDataUnions", async () => {
    const info = await DataUnion.loadDataUnions([
      "0xac336d865d4384c849046b96e060f6b4257533fccded131655abe8cb2517d697",
      "0x2e6a6b0ecd894700936d24789cd76c40a8ea7a316af8b84a34ea655303e03fdc",
      "0x6b2caffe1fd87366bf9e4bb5e3a366a31b6338de33ac0ae31079e454d603eee3",
    ]);
    console.log("[loadDataUnionDetailsBy] result: ", info);
  });

  it("loadDataTokens", async () => {
    const info = await DataToken.loadDataTokens([
      "0x9251E5100a934c636f9641884FD0F08Df295ec42",
      "0x98831422D04a7a6154648f657eAddAF7EbC59072",
    ]);
    console.log("[loadDataTokens] result: ", info);
  });
}).timeout(200000);
