interface IPageElements {
  [key: string]: JSX.Element
}

export interface PageArguments {
  changePage: (pageName: string, args: any[]) => void;
  pageArgs: any[];
}

export namespace PageController {
  export let CurrentPageArguments: any[] = [];
  export let CurrentPageIdentifier: string | undefined = undefined;
  export let LastPage: string | undefined = undefined;
}