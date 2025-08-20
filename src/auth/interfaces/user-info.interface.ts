export interface IUserInfo {
  user: IUser,
  localidades: ILocalidades
}

export interface IUser {
  userId: string,
  funcionario: IFuncionario;
  unidad: Unidad,
}

export interface Unidad {
  unidadId: number;
  abreviacion: string;
  municipioId: number;
  provinciaId: number;
  departamentoId: number;
}

export interface IFuncionario {
  funcionarioId: string;
  organismoPolicialId: number;
}

export interface ILocalidades {
  departamentoId: number,
  departamentoNombre: string,
  provincias: IProvincias[]
}

export interface IProvincias {
  provinciaId: number,
  provinciaNombre: string,
  municipios: IMunicipios[]
}

export interface IMunicipios {
  municipioId: number,
  municipioNombre: string
}