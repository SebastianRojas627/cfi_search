import { ResponseStorage } from "src/common/entities/response-storage.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OwnerItv } from "./itv-owner.entity";
import { DatosTecnicos } from "./itv-datos-tecnicos.entity";

@Entity('Itv')
export class ItvEntity extends ResponseStorage {
    @Column(() => DatosTecnicos)
    datos_tecnicos: DatosTecnicos;

    @OneToMany(() => OwnerItv, (owner) => owner.respuestaItv, {
        cascade: ["insert"],
        eager: true
    })
    personas: OwnerItv[]
}