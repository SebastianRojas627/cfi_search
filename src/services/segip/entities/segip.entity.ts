import { ResponseStorage } from 'src/common/entities/response-storage.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Segip')
export class SegipEntity extends ResponseStorage {
    @Column({ type: 'varchar', nullable: true, length: 10 })
    Complemento: string;

    @Column({ type: 'varchar', nullable: true, length: 255 })
    Domicilio: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    EstadoCivil: string;

    @Column({ type: 'date', nullable: true })
    FechaNacimiento: Date;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    LugarNacimientoDepartamento: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    LugarNacimientoLocalidad: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    LugarNacimientoPais: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    LugarNacimientoProvincia: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    NombreCompletoConyuge?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    NombreCompletoMadre: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    NombreCompletoPadre: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    NumeroDocumento: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    ProcedenciaRegistro: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    Nombres: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    PrimerApellido: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    ProfesionOcupacion: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    SegundoApellido: string;

    @Column({ type: 'varchar', nullable: true, length: 10 })
    ComplementoVisible: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    TipoRegistro: string;

    @Column({ type: 'varchar', nullable: true, length: 10 })
    Genero: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    Nacionalidad: string;

    @Column({ type: 'varchar', nullable: true, length: 20 })
    GrupoSanguineo?: string;

    @Column({ type: 'varchar', nullable: true, length: 50 })
    LugarExpedicion: string;

    @Column({ type: 'varchar', nullable: true })
    Fotografia: string;
}
