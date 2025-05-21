export type UserType = {
    id_usuario: number;
    nome: string;
    tipo: 'adm' | 'aluno' | 'prof';
    matricula?: string;
    ano_letivo?: string;
    curso?: string;
    turma?: number;
}