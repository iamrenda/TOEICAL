import { ErrorCode } from "../enums/ErrorCode.ts";

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];
