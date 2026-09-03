import type { ApiError } from "../../shared/contracts/api-error";

type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Rejector = (reason: ApiError) => void;


export type { Resolver, Rejector }