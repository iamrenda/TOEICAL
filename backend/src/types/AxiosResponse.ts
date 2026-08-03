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
