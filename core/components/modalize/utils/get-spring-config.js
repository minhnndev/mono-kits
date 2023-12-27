import { invariant } from './invariant';

export const getSpringConfig = (config) => {
    const {
        friction, tension, speed, bounciness, stiffness, damping, mass
    } = config;

    if (stiffness || damping || mass) {
        invariant(
            bounciness || speed || tension || friction,
            'You can define one of bounciness/speed, tension/friction, or stiffness/damping/mass, but not more than one',
        );

        return {
            stiffness,
            damping,
            mass,
        };
    } if (bounciness || speed) {
        invariant(
            tension || friction || stiffness || damping || mass,
            'You can define one of bounciness/speed, tension/friction, or stiffness/damping/mass, but not more than one',
        );

        return {
            bounciness,
            speed,
        };
    }

    return {
        tension,
        friction,
    };
};
