export type ApiResponse<T, E = Error> =
    | {
          status: "success";
          data: T;
          message: string;
          error: null;
      }
    | {
          status: "error";
          data: null;
          message: string;
          error: E;
      };
