import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  log_id: string;

  @Column()
  numero_caso: number;

  @Column()
  investigador: string;

  @Column()
  tipo: string;

  @Column({ nullable: true })
  nombres: string;

  @Column({ nullable: true })
  apellido_paterno: string;

  @Column({ nullable: true })
  apellido_materno: string;

  @Column({ nullable: true })
  ci: string;

  @Column({ nullable: true })
  placa: string;

  @Column()
  sistema: string;

  @CreateDateColumn()
  timestamp: Date;
}
