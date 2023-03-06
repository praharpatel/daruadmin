export interface IApiproveedor {
  id: string;
  name: string;
  slug: string;
  uri_base: string;
  token: IToken;
  catalogos: ICatalogos[];
}

export interface IToken {
  verbo: string;
  uri: string;
  body: IBody;
  requiere_token: boolean;
  tipo_token: string;
}

export interface IBody  {
  client_id: string;
  client_secret: string;
  grant_type: string;
}

export interface ICatalogos {
  name: string;
  uri: string;
  headers: IHeader;
}

export interface IHeader {
  autorization: string;
}
