// Axios response type definition (currently only used for internal API calls)
export type AxiosResponse<T, E = Error> =
    | {
          status: "success";
          code: number;
          data: T;
          error: null;
      }
    | {
          status: "error";
          code: number;
          data: null;
          error: E;
      };
