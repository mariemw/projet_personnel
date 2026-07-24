type InfraType = "Pare-feu" | "Serveur Web" |"Base de données" |"Générateur d'énergie";

export interface Infrastructure{

    type: InfraType;

    health: number;
    isBlocked?:boolean

    // status?: InfrastructureStatus;

    // activeEffects?: Effect[];

    // position?:string;
}