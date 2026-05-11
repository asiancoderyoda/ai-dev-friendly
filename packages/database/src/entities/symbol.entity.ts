import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Symbol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    type: string;

    @Column()
    filePath: string;

    @Column("simple-array")
    imports: string[];

    @Column("simple-array")
    exports: string[];

    @Column("simple-array", { nullable: true })
    methods?: string[];
}