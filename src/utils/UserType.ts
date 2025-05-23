export type UserType = {
    id_usuario: number;
    tipo: 'adm' | 'estudante' | 'prof';
    nome?: string;
    ano_letivo?: string;
    curso?: string;
}