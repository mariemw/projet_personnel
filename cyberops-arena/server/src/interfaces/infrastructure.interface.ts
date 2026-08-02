import { Effect } from "src/enums/effect.enum";
import { InfrastructureStatus } from "src/enums/infrastructureStatus.enum";
import { InfraType } from "src/enums/infraType.enum";

export interface Infrastructure{

    type: InfraType;

    health: number;

    // status?: InfrastructureStatus;

    // activeEffects?: Effect[];

    // position?:string;

    isBlocked?:boolean,

    ddosTimer?:number
}