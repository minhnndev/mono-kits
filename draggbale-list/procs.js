import Animated from 'react-native-reanimated';

const {
  or,
  set,
  cond,
  add,
  sub,
  block,
  eq,
  neq,
  and,
  divide,
  greaterThan,
  greaterOrEq,
  not,
  Value,
  spring,
  lessThan,
  lessOrEq,
  multiply,
} = Animated;
let { proc } = Animated;

if (!proc) {
  console.warn('Use reanimated > 1.3 for optimal perf');
  const procStub = (cb) => cb;
  proc = procStub;
}

export const getIsAfterActive = proc(
  (currentIndex, activeIndex) =>
    greaterThan(currentIndex, activeIndex)
);

export const getCellStart = proc(
  (
    isAfterActive,
    offset,
    activeCellSize,
    scrollOffset
  ) =>
    sub(cond(isAfterActive, sub(offset, activeCellSize), offset), scrollOffset)
);

export const getOnChangeTranslate = proc(
  (
    translate,
    isAfterActive,
    initialized,
    toValue,
    isPressedIn
  ) =>
    block([
      cond(or(not(isAfterActive), initialized), [], set(initialized, 1)),
      cond(isPressedIn, set(toValue, translate)),
    ])
);

export const hardReset = proc(
  (
    position,
    finished,
    time,
    toValue
  ) =>
    block([set(position, 0), set(finished, 0), set(time, 0), set(toValue, 0)])
);

/**
 * The in react-native-reanimated.d.ts definition of `proc` only has generics
 * for up to 10 arguments. We cast it to accept any params to avoid errors when
 * type-checking.
 */

export const setupCell = proc(
  (
    currentIndex,
    initialized,
    size,
    offset,
    isAfterActive,
    translate,
    prevTrans,
    prevSpacerIndex,
    activeIndex,
    activeCellSize,
    hoverOffset,
    scrollOffset,
    isHovering,
    hoverTo,
    hasMoved,
    spacerIndex,
    toValue,
    position,
    time,
    finished,
    runSpring,
    onHasMoved,
    onChangeSpacerIndex,
    onFinished,
    isPressedIn,
    placeholderOffset
  ) =>
    block([
      set(isAfterActive, getIsAfterActive(currentIndex, activeIndex)),

      // Determining spacer index is hard to visualize.
      // see diagram here: https://i.imgur.com/jRPf5t3.jpg
      cond(
        isPressedIn,
        cond(
          isAfterActive,
          [
            cond(
              and(
                greaterOrEq(add(hoverOffset, activeCellSize), offset),
                lessThan(
                  add(hoverOffset, activeCellSize),
                  add(offset, divide(size, 2))
                )
              ),
              set(spacerIndex, sub(currentIndex, 1))
            ),
            cond(
              and(
                greaterOrEq(
                  add(hoverOffset, activeCellSize),
                  add(offset, divide(size, 2))
                ),
                lessThan(add(hoverOffset, activeCellSize), add(offset, size))
              ),
              set(spacerIndex, currentIndex)
            ),
          ],
          cond(lessThan(currentIndex, activeIndex), [
            cond(
              and(
                lessThan(hoverOffset, add(offset, size)),
                greaterOrEq(hoverOffset, add(offset, divide(size, 2)))
              ),
              set(spacerIndex, add(currentIndex, 1))
            ),
            cond(
              and(
                greaterOrEq(hoverOffset, offset),
                lessThan(hoverOffset, add(offset, divide(size, 2)))
              ),
              set(spacerIndex, currentIndex)
            ),
          ])
        )
      ),

      // Translate cell down if it is before active index and active cell has passed it.
      // Translate cell up if it is after the active index and active cell has passed it.
      cond(
        neq(currentIndex, activeIndex),
        set(
          translate,
          cond(
            cond(
              isAfterActive,
              lessOrEq(currentIndex, spacerIndex),
              greaterOrEq(currentIndex, spacerIndex)
            ),
            cond(
              isHovering,
              cond(isAfterActive, multiply(activeCellSize, -1), activeCellSize),
              0
            ),
            0
          )
        )
      ),

      // Set value hovering element will snap to once released
      cond(
        and(isHovering, eq(spacerIndex, currentIndex)),
        set(
          hoverTo,
          sub(
            offset,
            scrollOffset,
            cond(isAfterActive, sub(activeCellSize, size), 0) // Account for cells of differing size
          )
        )
      ),

      set(toValue, translate),
      cond(and(isPressedIn, neq(translate, prevTrans)), [
        set(prevTrans, translate),
        getOnChangeTranslate(
          translate,
          isAfterActive,
          initialized,
          toValue,
          isPressedIn
        ),
        cond(hasMoved, onHasMoved, set(position, translate)),
      ]),
      cond(neq(prevSpacerIndex, spacerIndex), [
        set(prevSpacerIndex, spacerIndex),
        cond(eq(spacerIndex, -1), [
          // Hard reset to prevent stale state bugs
          onChangeSpacerIndex,
          hardReset(position, finished, time, toValue),
        ]),
      ]),
      runSpring,
      cond(finished, [onFinished, set(time, 0), set(finished, 0)]),
      cond(
        eq(spacerIndex, currentIndex),
        set(
          placeholderOffset,
          cond(isAfterActive, add(sub(offset, activeCellSize), size), offset)
        )
      ),
      position,
    ])
);

const betterSpring = (proc)(
  (
    finished,
    velocity,
    position,
    time,
    prevPosition,
    toValue,
    damping,
    mass,
    stiffness,
    overshootClamping,
    restSpeedThreshold,
    restDisplacementThreshold,
    clock
  ) =>
    spring(
      clock,
      {
        finished,
        velocity,
        position,
        time,
        // @ts-ignore -- https://github.com/software-mansion/react-native-reanimated/blob/master/src/animations/spring.js#L177
        prevPosition,
      },
      {
        toValue,
        damping,
        mass,
        stiffness,
        overshootClamping,
        restDisplacementThreshold,
        restSpeedThreshold,
      }
    )
);

export function springFill(
  clock,
  state,
  config
) {
  return betterSpring(
    state.finished,
    state.velocity,
    state.position,
    state.time,
    new Value(0),
    config.toValue,
    config.damping,
    config.mass,
    config.stiffness,
    config.overshootClamping,
    config.restSpeedThreshold,
    config.restDisplacementThreshold,
    clock
  );
}
