import { HorarioType } from "./HorarioType";
import { UserType } from "./UserType";

export type CadeiraType = {
    id: string;
    horarios: HorarioType[];
    estudantes: UserType[];
    professor: UserType;
}