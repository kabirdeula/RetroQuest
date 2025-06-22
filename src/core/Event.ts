/**
 * A simple event bus for registering, emitting, and unsubscribing events.
 */
class Events {
  /** Stores registered event callbacks */
  private callbacks: {
    id: number;
    eventName: string;
    caller: any;
    callback: (value: any) => void;
  }[] = [];

  /** Unique ID counter for each subscription */
  private nextId: number = 0;

  /**
   * Emit an event to all listeners of a given event name.
   *
   * @param eventName - The name of the event to emit.
   * @param value - The data to pass to the event listeners.
   */
  emit(eventName: any, value: any): void {
    this.callbacks.forEach((stored) => {
      if (stored.eventName === eventName) {
        stored.callback(value);
      }
    });
  }

  /**
   * Register a new event listener.
   *
   * @param eventName - The name of the event to listen to.
   * @param caller - The subscribing object (used for group unsubscription).
   * @param callback - The function to call when the event is emitted.
   * @returns - A unique ID for this subscription.
   */
  on(eventName: string, caller: any, callback: (value: any) => void): number {
    this.nextId += 1;
    this.callbacks.push({
      id: this.nextId,
      eventName,
      caller,
      callback,
    });
    return this.nextId;
  }

  /**
   * Remove a specific event subscription by ID.
   *
   * @param id - The subscription ID to remove.
   */
  off(id: number): void {
    this.callbacks = this.callbacks.filter((stored) => stored.id !== id);
  }

  /**
   * Unsubscribe all event listeners for a specific caller.
   *
   * @param caller - The caller object to unsubscribe.
   */
  unsubscribe(caller: any): void {
    this.callbacks = this.callbacks.filter(
      (stored) => stored.caller !== caller
    );
  }
}

/**
 * Shared global event bus instance.
 */
export const events = new Events();
