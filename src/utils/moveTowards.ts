import type { Vector2 } from "../core/Vector2";

/**
 * Moves an object's position towards a target destination by a given speed.
 *
 * @param entity - The object with a `position` property (Vector2) to move.
 * @param destinationPosition - The target position to move towards.
 * @param speed - The maximum distance to move in this step.
 * @returns - The remaining distance to the destination after movement.
 */
export function moveTowards(
  entity: { position: Vector2 },
  destinationPosition: Vector2,
  speed: number
) {
  let dx = destinationPosition.x - entity.position.x;
  let dy = destinationPosition.y - entity.position.y;

  let distance = Math.sqrt(dx ** 2 + dy ** 2);

  if (distance <= speed) {
    // Snap to destination if within speed range.
    entity.position.x = destinationPosition.x;
    entity.position.y = destinationPosition.y;
  } else {
    // Move towards destination.
    let normalizedX = dx / distance;
    let normalizedY = dy / distance;

    entity.position.x += normalizedX * speed;
    entity.position.y += normalizedY * speed;

    // Recalculate remaining distance.
    dx = destinationPosition.x - entity.position.x;
    dy = destinationPosition.y - entity.position.y;
    distance = Math.sqrt(dx ** 2 + dy ** 2);
  }

  return distance;
}
