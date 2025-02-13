class User {
    id!: number;
    name!: string;
    role!: string;

    public constructor(id?: number, name?: string, role?: string) {
        if(id && name && role){
            this.id = id;
            this.name = name;
            this.role = role;
        }
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getRole(): string {
        return this.role;
    }

    public setId(id: number) {
        this.id = id;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setRole(role: string) {
        this.role = role;
    }
}

export default User;
