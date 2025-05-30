export type UserType = {
    id: number;
    tipo: 'adm' | 'estudante' | 'prof';
    nome?: string;
    ano_lectivo?: string;
    curso?: string;
    "dados faciais"?: string;
}