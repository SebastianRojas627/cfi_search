import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItvEntity } from './itv.entity';

@Entity('OwnerItv')
export class OwnerItv {
    @PrimaryGeneratedColumn('uuid')
    owner_itv_id: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    gestion: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    nombre: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    paterno: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    materno: string;

    @Column({ type: 'varchar', nullable: true, length: 15 })
    nro_documento: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    expedicion: string;

    @Column({ type: 'date', nullable: true })
    fecha_nacimiento?: Date | null;

    @Column({ type: 'varchar', nullable: true, length: 10 })
    sexo: string;

    @Column({ type: 'varchar', nullable: true, length: 15 })
    nro_celular: string;

    @Column({ type: 'varchar', nullable: true, length: 100 })
    email: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    categoria_licencia: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    domicilio: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    documento_complemento: string;

    @Column({ type: 'varchar', nullable: true })
    fotografia: string;

    @ManyToOne(() => ItvEntity, (respuestaItv) => respuestaItv.personas)
    @JoinColumn({ name: "respuesta_itv_id" })
    respuestaItv: ItvEntity;
}
