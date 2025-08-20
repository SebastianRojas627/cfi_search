import { Column, PrimaryGeneratedColumn } from "typeorm";

export class ResponseStorage {
    @PrimaryGeneratedColumn('uuid')
    respuesta_id: string;

    @Column({ type: 'timestamp' })
    fecha_creacion: Date;

    @Column({ type: 'timestamp'})
    fecha_actualizacion: Date
}

/*
itv: "fecha_nacimiento": "1979-03-09 00:00:00",
segip: "FechaNacimiento": "11/11/2000",

*/