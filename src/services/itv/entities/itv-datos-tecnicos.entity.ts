import { Column, Entity } from 'typeorm';

export class DatosTecnicos {
    @Column({ type: 'varchar', length: 10 })
    placa: string;

    @Column({ type: 'varchar', length: 50 })
    marca: string;

    @Column({ type: 'varchar', length: 20 })
    modelo: string;

    @Column({ type: 'varchar', length: 50 })
    industria: string;

    @Column({ type: 'varchar', length: 50 })
    clase: string;

    @Column({ type: 'varchar', length: 50 })
    servicio: string;

    @Column({ type: 'varchar', length: 50 })
    tipo_vehiculo: string;

    @Column({ type: 'varchar', length: 50 })
    color: string;

    @Column({ type: 'varchar', length: 50 })
    cilindrada: string;

    @Column({ type: 'varchar', length: 50 })
    chasis: string;

    @Column({ type: 'varchar', length: 50 })
    motor: string;

    @Column({ type: 'varchar', length: 50 })
    radicatoria: string;

    @Column({ type: 'varchar' })
    fotografia: string;
}
