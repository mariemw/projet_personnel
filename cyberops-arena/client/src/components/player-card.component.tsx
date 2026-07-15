import type { player } from "../interfaces/player.interface";
import "./player-card.component.css";

interface Props {
    player: player;
}

export default function PlayerCard({ player }: Props) {

    return (
        <div className="player-card">
            <div className="avatar">
                👤
            </div>

            <h3>{player.name}</h3>

            <p>
                {player.role}
            </p>

            <span>
                Connecté
            </span>
        </div>
    );
}