declare namespace G {
  interface AnyObject<T=any> {
    [key: string]: T;
  }
  interface Response {
    code: number;
    data: AnyObject | null;
    msg: string;
  }
}
