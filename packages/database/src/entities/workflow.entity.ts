import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  status!: string;

  @Column("text")
  ticket!: string;

  @Column()
  repoSlug!: string;

  @Column()
  repoPath!: string;

  @Column()
  currentStep!: string;

  @Column({ nullable: true })
  branchName?: string;

  @Column({ nullable: true })
  prUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
