import Position from "../utils/position";
interface Component {
    draw(n: number, pos?: Position): void;
}
export { Component };
