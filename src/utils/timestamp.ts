import { ONE_DAY, MAX_UINT72 } from "../data-token/constants";

/**
 * @dev current timestamp
 * @notice in seconds
 */
export const currentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * @notice timestamp in seconds
 */
export const oneDayLater = () => {
  return (Math.floor(Date.now() / 1000) + ONE_DAY).toString();
};

/**
 * @notice timestamp in seconds
 */
export const oneWeekLater = () => {
  return (Math.floor(Date.now() / 1000) + ONE_DAY * 7).toString();
};

/**
 * @notice timestamp in seconds
 */
export const oneMonthLater = () => {
  return (Math.floor(Date.now() / 1000) + ONE_DAY * 30).toString();
};

/**
 * @notice timestamp in seconds
 * @return max uint72
 */
export const infiniteTime = () => {
  return MAX_UINT72;
};
