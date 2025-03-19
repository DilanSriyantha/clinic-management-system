export enum EventVisibility {
    PRIVATE,
    PUBLIC
};

export namespace EventVisibility {
    export function valueOf(value: number | string) {
        if(typeof value === "string") {
            if(!(value in EventVisibility)) return undefined;

            return EventVisibility[value as keyof typeof EventVisibility];
        }

        if(typeof value === "number") {
            return Object.values(EventVisibility).includes(value as EventVisibility) ? value as EventVisibility : undefined;
        }
    }
};