import BlockNumberConfigJson from "./block.config.json";
import DeployedContractsJson from "./contracts.config.json";
import ApiConfig from "./api.config.json";
import RpcUrlConfig from "./rpc.config.json";

const DeployedContracts = DeployedContractsJson as any;
const BlockNumberConfig = BlockNumberConfigJson as any;

export { BlockNumberConfig, DeployedContracts, ApiConfig, RpcUrlConfig };
