import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  log_id: string;

  @Column()
  solicitud_informacion_id: string;

  @Column()
  tipo: string;

  @Column({ nullable: true })
  ci: string;

  @Column({ nullable: true })
  complemento: string;

  @Column({ nullable: true })
  placa: string;

  @Column()
  sistema: string;

  @CreateDateColumn()
  timestamp: Date;
}
